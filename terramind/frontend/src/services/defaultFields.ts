import { DemoField, FieldDigitalTwin } from '../types/terramind';
import allTwinsData from './allFieldTwins.json';

export const ALL_FIELD_TWINS = (allTwinsData as any).twins as Record<string, FieldDigitalTwin>;
export const ALL_FIELD_CALENDARS = (allTwinsData as any).calendars as Record<string, any>;

export const DEFAULT_DEMO_FIELDS: DemoField[] = [
  {
    id: "field_california",
    name: "San Joaquin Valley Farm",
    region: "Central Valley, California, USA",
    latitude: 36.8025,
    longitude: -119.8145,
    area_hectares: 52.0,
    elevation_m: 82.0,
    default_previous_crop: "tomatoes",
    irrigation_available: true,
    description: "High-value Mediterranean agricultural basin; intensive drip fertigation, high solar insolation, and managed alluvial soils.",
    polygon_coordinates: [
      [36.8000, -119.8180],
      [36.8060, -119.8185],
      [36.8055, -119.8100],
      [36.7995, -119.8095]
    ]
  },
  {
    id: "field_konya",
    name: "Konya Central Anatolian Wheat & Barley Farm",
    region: "Konya Basin, Central Anatolia, Turkey",
    latitude: 37.8746,
    longitude: 32.4932,
    area_hectares: 45.2,
    elevation_m: 1016.0,
    default_previous_crop: "wheat",
    irrigation_available: false,
    description: "Continental semiarid steppe plateau; major dryland breadbasket of Turkey with calcareous alkaline soils.",
    polygon_coordinates: [
      [37.8720, 32.4890],
      [37.8780, 32.4895],
      [37.8775, 32.4975],
      [37.8715, 32.4970]
    ]
  },
  {
    id: "field_iowa",
    name: "Story County Corn & Soybean Prairie",
    region: "Iowa Corn Belt, USA",
    latitude: 42.0347,
    longitude: -93.6200,
    area_hectares: 64.0,
    elevation_m: 298.0,
    default_previous_crop: "corn",
    irrigation_available: false,
    description: "Deep fertile Mollisol topsoil with high organic matter; rainfed continental corn and soybean rotation.",
    polygon_coordinates: [
      [42.0310, -93.6250],
      [42.0385, -93.6255],
      [42.0380, -93.6145],
      [42.0305, -93.6140]
    ]
  },
  {
    id: "field_brazil",
    name: "Mato Grosso Soy & Cotton Fazenda",
    region: "Cerrado Agricultural Belt, Brazil",
    latitude: -12.5500,
    longitude: -55.7200,
    area_hectares: 120.0,
    elevation_m: 385.0,
    default_previous_crop: "sunflower",
    irrigation_available: false,
    description: "Tropical savannah Oxisol with bimodal monsoonal rainfall; heavy clay with managed dolomitic lime conditioning.",
    polygon_coordinates: [
      [-12.5450, -55.7260],
      [-12.5550, -55.7270],
      [-12.5560, -55.7140],
      [-12.5440, -55.7130]
    ]
  },
  {
    id: "field_ukraine",
    name: "Poltava Deep Chernozem Cereal Farm",
    region: "Central Ukrainian Black Earth Belt, Ukraine",
    latitude: 49.5883,
    longitude: 34.5514,
    area_hectares: 80.0,
    elevation_m: 153.0,
    default_previous_crop: "wheat",
    irrigation_available: false,
    description: "Deep fertile Chernozem with organic carbon exceeding 4.2%; globally renowned winter wheat and sunflower heartland.",
    polygon_coordinates: [
      [49.5840, 34.5450],
      [49.5920, 34.5460],
      [49.5915, 34.5570],
      [49.5835, 34.5560]
    ]
  },
  {
    id: "field_france",
    name: "Bordeaux Viticulture & Wheat Belt",
    region: "Aquitaine / Gironde Plain, France",
    latitude: 44.8378,
    longitude: -0.5792,
    area_hectares: 32.5,
    elevation_m: 42.0,
    default_previous_crop: "barley",
    irrigation_available: false,
    description: "Temperate oceanic gravelly loam; optimal capillary moisture and mild winters for winter cereals and specialty crops.",
    polygon_coordinates: [
      [44.8340, -0.5840],
      [44.8410, -0.5845],
      [44.8405, -0.5735],
      [44.8335, -0.5730]
    ]
  },
  {
    id: "field_kenya",
    name: "Nakuru Rift Valley Highlands Parcel",
    region: "Rift Valley Province, Kenya",
    latitude: -0.3031,
    longitude: 36.0800,
    area_hectares: 24.0,
    elevation_m: 1850.0,
    default_previous_crop: "corn",
    irrigation_available: false,
    description: "High-altitude volcanic andosol with stable equatorial temperatures and bimodal long-rains/short-rains cycles.",
    polygon_coordinates: [
      [-0.3000, 36.0760],
      [-0.3060, 36.0770],
      [-0.3055, 36.0845],
      [-0.2995, 36.0835]
    ]
  },
  {
    id: "field_india",
    name: "Ludhiana Alluvial Grain Belt",
    region: "Punjab Grain Belt, India",
    latitude: 30.9010,
    longitude: 75.8573,
    area_hectares: 18.0,
    elevation_m: 244.0,
    default_previous_crop: "wheat",
    irrigation_available: true,
    description: "High-intensity irrigated alluvial plain; central breadbasket of India with seasonal monsoon dynamics.",
    polygon_coordinates: [
      [30.8980, 75.8530],
      [30.9040, 75.8540],
      [30.9035, 75.8615],
      [30.8975, 75.8605]
    ]
  },
  {
    id: "field_sanliurfa",
    name: "Harran Plain Irrigated Cotton & Cereal Parcel",
    region: "Şanlıurfa, Southeastern Anatolia (GAP), Turkey",
    latitude: 37.1674,
    longitude: 38.7955,
    area_hectares: 62.8,
    elevation_m: 518.0,
    default_previous_crop: "cotton",
    irrigation_available: true,
    description: "Fertile Red-Brown Vertisol plain supported by the Atatürk Dam GAP irrigation canal network; hot dry summers.",
    polygon_coordinates: [
      [37.1640, 38.7910],
      [37.1710, 38.7920],
      [37.1700, 38.8010],
      [37.1630, 38.7995]
    ]
  }
];

export const DEFAULT_FIELD = DEFAULT_DEMO_FIELDS[0];
export const BASELINE_DIGITAL_TWIN = ALL_FIELD_TWINS["field_california"];
