import { City } from '@/types'

export const cities: City[] = [
  { id: 'tashkent', name: 'Tashkent', nameKey: 'cities.tashkent', lat: 41.2995, lng: 69.2401 },
  { id: 'samarkand', name: 'Samarkand', nameKey: 'cities.samarkand', lat: 39.6542, lng: 66.9597 },
  { id: 'bukhara', name: 'Bukhara', nameKey: 'cities.bukhara', lat: 39.7681, lng: 64.4556 },
  { id: 'namangan', name: 'Namangan', nameKey: 'cities.namangan', lat: 41.0011, lng: 71.6722 },
  { id: 'andijan', name: 'Andijan', nameKey: 'cities.andijan', lat: 40.7821, lng: 72.3442 },
  { id: 'fergana', name: 'Fergana', nameKey: 'cities.fergana', lat: 40.3864, lng: 71.7864 },
  { id: 'nukus', name: 'Nukus', nameKey: 'cities.nukus', lat: 42.4619, lng: 59.6166 },
  { id: 'urgench', name: 'Urgench', nameKey: 'cities.urgench', lat: 41.5500, lng: 60.6333 },
  { id: 'kokand', name: 'Kokand', nameKey: 'cities.kokand', lat: 40.5286, lng: 70.9425 },
  { id: 'navoi', name: 'Navoi', nameKey: 'cities.navoi', lat: 40.1033, lng: 65.3792 },
  { id: 'jizzakh', name: 'Jizzakh', nameKey: 'cities.jizzakh', lat: 40.1158, lng: 67.8422 },
  { id: 'termez', name: 'Termez', nameKey: 'cities.termez', lat: 37.2242, lng: 67.2783 },
  { id: 'qarshi', name: 'Qarshi', nameKey: 'cities.qarshi', lat: 38.8600, lng: 65.8000 },
  { id: 'margilan', name: 'Margilan', nameKey: 'cities.margilan', lat: 40.4697, lng: 71.7147 },
]

export const parameterThresholds = {
  aqi: { good: 50, moderate: 100, poor: 150 },
  wqi: { good: 80, moderate: 60, poor: 40 },
  sqi: { good: 80, moderate: 60, poor: 40 },
  uv: { good: 2, moderate: 5, poor: 7 },
  temperature: { good: 25, moderate: 30, poor: 35 },
  humidity: { good: 60, moderate: 70, poor: 80 },
  wind: { good: 15, moderate: 25, poor: 40 },
  precipitation: { good: 5, moderate: 15, poor: 30 },
}

export const parameterUnits: Record<string, string> = {
  aqi: 'AQI',
  wqi: 'WQI',
  sqi: 'SQI',
  uv: 'Index',
  temperature: '°C',
  humidity: '%',
  wind: 'km/h',
  precipitation: 'mm',
}

export const parameterLabels: Record<string, string> = {
  aqi: 'home.airQuality',
  wqi: 'home.waterQuality',
  sqi: 'home.soilQuality',
  uv: 'home.uvIndex',
  temperature: 'home.temperature',
  humidity: 'home.humidity',
  wind: 'home.wind',
  precipitation: 'home.precipitation',
}
