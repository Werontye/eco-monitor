const API_BASE = import.meta.env.VITE_API_URL || '/api'

export interface WeatherData {
  cityId: string
  temperature: number
  humidity: number
  wind: number
  pressure: number
  description?: string
  icon?: string
  timestamp: string
}

export interface AirQualityData {
  cityId: string
  aqi: number
  status: string
  pm25?: number
  pm10?: number
  o3?: number
  no2?: number
  so2?: number
  co?: number
  timestamp: string
}

export interface AIResponse {
  message: string
  timestamp: string
}

class ApiService {
  private baseUrl: string

  constructor() {
    this.baseUrl = API_BASE
  }

  private async fetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }))
      throw new Error(error.error || `HTTP error ${response.status}`)
    }

    return response.json()
  }

  // Health check
  async checkHealth(): Promise<boolean> {
    try {
      await this.fetch('/health')
      return true
    } catch {
      return false
    }
  }

  // Weather API
  async getWeather(cityId: string): Promise<WeatherData> {
    return this.fetch(`/weather/${cityId}`)
  }

  async getAllWeather(): Promise<WeatherData[]> {
    return this.fetch('/weather')
  }

  async getUV(cityId: string): Promise<{ cityId: string; uv: number; timestamp: string }> {
    return this.fetch(`/weather/${cityId}/uv`)
  }

  // Air Quality API
  async getAirQuality(cityId: string): Promise<AirQualityData> {
    return this.fetch(`/air-quality/${cityId}`)
  }

  async getAllAirQuality(): Promise<AirQualityData[]> {
    return this.fetch('/air-quality')
  }

  // AI Chat API
  async chat(message: string, language: string = 'en'): Promise<AIResponse> {
    return this.fetch('/ai/chat', {
      method: 'POST',
      body: JSON.stringify({ message, language }),
    })
  }
}

export const api = new ApiService()
