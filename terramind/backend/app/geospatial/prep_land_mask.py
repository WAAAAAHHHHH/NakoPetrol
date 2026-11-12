import urllib.request
import json
import time
import pickle
from shapely.geometry import shape
from shapely import wkb

url = 'https://raw.githubusercontent.com/martynafford/natural-earth-geojson/master/10m/physical/ne_10m_land.json'
print('Downloading 18MB ne_10m_land.json...')
t0 = time.time()
with urllib.request.urlopen(url, timeout=45) as r:
    data = json.loads(r.read().decode('utf-8'))

print(f"Downloaded {len(data['features'])} features in {time.time()-t0:.2f}s")

geoms = []
for f in data['features']:
    try:
        g = shape(f['geometry'])
        if not g.is_empty:
            geoms.append(g)
    except Exception as e:
        pass

wkb_list = [wkb.dumps(g) for g in geoms]
target_path = 'terramind/backend/app/geospatial/ne_10m_land.wkb'
with open(target_path, 'wb') as f:
    pickle.dump(wkb_list, f, protocol=pickle.HIGHEST_PROTOCOL)

print(f"Saved {len(wkb_list)} geometries to {target_path} successfully!")

