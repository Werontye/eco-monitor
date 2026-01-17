export type Status = 'good' | 'moderate' | 'poor' | 'alert'

export interface City {
  id: string
  name: string
  nameKey: string
  lat: number
  lng: number
}

export interface SensorData {
  id: string
  cityId: string
  parameter: EnvironmentParameter
  value: number
  unit: string
  status: Status
  timestamp: Date
  delta24h: number
  trend: 'up' | 'down' | 'stable'
  sparklineData: number[]
}

export type EnvironmentParameter =
  | 'aqi'
  | 'wqi'
  | 'sqi'
  | 'uv'
  | 'temperature'
  | 'humidity'
  | 'wind'
  | 'precipitation'

export interface ChartDataPoint {
  time: string
  value: number
  [key: string]: string | number
}

export interface KPICardData {
  id: string
  parameter: EnvironmentParameter
  label: string
  value: number
  unit: string
  status: Status
  trend: 'up' | 'down' | 'stable'
  delta: number
  sparklineData: number[]
  icon: string
}

export interface Product {
  id: string
  nameKey: string
  descriptionKey: string
  image: string
  price: number
  category: 'air' | 'water' | 'kit'
  monitorsKeys: string[]
  difficulty: 'easy' | 'medium' | 'advanced'
  inStock: boolean
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export interface TimeRange {
  value: '24h' | '7d' | '30d'
  label: string
}

export interface FilterState {
  cities: string[]
  parameters: EnvironmentParameter[]
  timeRange: TimeRange['value']
  status: Status | 'all'
}
