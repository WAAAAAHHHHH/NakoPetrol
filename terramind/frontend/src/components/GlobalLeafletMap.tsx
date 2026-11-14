import React, { useEffect, useRef } from 'react';
import L from 'leaflet';

interface GlobalLeafletMapProps {
  latitude: number;
  longitude: number;
  polygonCoordinates?: number[][];
  fieldName: string;
  activeLayer: string;
  onMapClick: (lat: number, lon: number) => void;
  zoomLevel: number;
}

export const GlobalLeafletMap: React.FC<GlobalLeafletMapProps> = ({
  latitude,
  longitude,
  polygonCoordinates,
  fieldName,
  activeLayer,
  onMapClick,
  zoomLevel
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const baseTileLayerRef = useRef<L.TileLayer | null>(null);
  const activePolygonRef = useRef<L.Polygon | L.Circle | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  // 1. Initialize Map instance once
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [latitude, longitude],
        zoom: zoomLevel,
        zoomControl: false,
        attributionControl: false
      });

      // High-resolution Esri World Imagery (Real High-Res Satellite Photos worldwide)
      const satelliteLayer = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        {
          maxZoom: 19,
          attribution: 'Esri World Imagery, Maxar, Earthstar Geographics'
        }
      ).addTo(map);

      baseTileLayerRef.current = satelliteLayer;

      // Handle user clicking anywhere on Earth
      map.on('click', (e: L.LeafletMouseEvent) => {
        onMapClick(e.latlng.lat, e.latlng.lng);
      });

      mapInstanceRef.current = map;

      // Invalidate size shortly after mount to ensure tiles render immediately
      setTimeout(() => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize();
        }
      }, 100);
    }

    const observer = new ResizeObserver(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    });
    if (mapContainerRef.current) {
      observer.observe(mapContainerRef.current);
    }

    return () => {
      observer.disconnect();
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // 2. Handle base layer changes (Satellite, OSM, Topo, NDVI)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (baseTileLayerRef.current) {
      map.removeLayer(baseTileLayerRef.current);
    }

    let tileUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
    let maxZ = 19;

    if (activeLayer === 'osm' || activeLayer === 'cadastral') {
      tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
      maxZ = 19;
    } else if (activeLayer === 'dark') {
      tileUrl = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
      maxZ = 19;
    } else if (activeLayer === 'topo') {
      tileUrl = 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png';
      maxZ = 17;
    }

    const newLayer = L.tileLayer(tileUrl, { maxZoom: maxZ }).addTo(map);
    baseTileLayerRef.current = newLayer;
  }, [activeLayer]);

  // 3. Update view and polygon when coordinates or field changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Smoothly fly to the location
    map.flyTo([latitude, longitude], map.getZoom() || 14, {
      duration: 1.2
    });

    // Remove prior polygon & marker
    if (activePolygonRef.current) {
      map.removeLayer(activePolygonRef.current);
      activePolygonRef.current = null;
    }
    if (markerRef.current) {
      map.removeLayer(markerRef.current);
      markerRef.current = null;
    }

    // Determine polygon styling based on active layer
    let fillColor = '#10B981';
    let fillOpacity = 0.25;

    if (activeLayer === 'ndvi') {
      fillColor = '#22C55E';
      fillOpacity = 0.65;
    } else if (activeLayer === 'thermal') {
      fillColor = '#F59E0B';
      fillOpacity = 0.60;
    } else if (activeLayer === 'color_infrared') {
      fillColor = '#EF4444';
      fillOpacity = 0.55;
    } else if (activeLayer === 'soil_ph') {
      fillColor = '#8B5CF6';
      fillOpacity = 0.50;
    }

    if (polygonCoordinates && polygonCoordinates.length >= 3) {
      const latlngs: L.LatLngExpression[] = polygonCoordinates.map(c => [c[0], c[1]]);
      const polygon = L.polygon(latlngs, {
        color: '#FFFFFF',
        weight: 2.2,
        fillColor,
        fillOpacity
      }).addTo(map);

      polygon.bindTooltip(fieldName, {
        permanent: true,
        direction: 'center',
        className: 'leaflet-dark-pill-label'
      });

      activePolygonRef.current = polygon;
    } else {
      // Point circle parcel (250m radius)
      const circle = L.circle([latitude, longitude], {
        radius: 250,
        color: '#FFFFFF',
        weight: 2.2,
        fillColor,
        fillOpacity
      }).addTo(map);

      circle.bindTooltip(fieldName, {
        permanent: true,
        direction: 'center',
        className: 'leaflet-dark-pill-label'
      });

      activePolygonRef.current = circle;
    }
  }, [latitude, longitude, polygonCoordinates, fieldName, activeLayer]);

  // 4. Handle Zoom Level updates
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (map && map.getZoom() !== zoomLevel) {
      map.setZoom(zoomLevel);
    }
  }, [zoomLevel]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Layer-specific CSS Color Grade Filter for the satellite tiles */}
      {activeLayer === 'color_infrared' && (
        <div className="absolute inset-0 pointer-events-none mix-blend-color bg-red-900/30 z-10" />
      )}
      {activeLayer === 'ndvi' && (
        <div className="absolute inset-0 pointer-events-none mix-blend-color bg-emerald-600/25 z-10" />
      )}
      {activeLayer === 'thermal' && (
        <div className="absolute inset-0 pointer-events-none mix-blend-color bg-amber-600/30 z-10" />
      )}
    </div>
  );
};

