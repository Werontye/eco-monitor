import { SensorData, EnvironmentParameter, Status } from '@/types'
import { cities, parameterThresholds, parameterUnits } from './cities'
import { generateSparklineData, getStatusFromValue } from '@/lib/utils'

function getRandomValue(min: number, max: number): number {
  return Math.round((Math.random() * (max - min) + min) * 10) / 10
}

export function generateSensorData(): SensorData[] {
  const parameters: EnvironmentParameter[] = ['aqi', 'wqi', 'sqi', 'uv', 'temperature', 'humidity', 'wind', 'precipitation']
  const data: SensorData[] = []

  const valueRanges: Record<EnvironmentParameter, [number, number]> = {
    aqi: [20, 180],
    wqi: [30, 95],
    sqi: [35, 90],
    uv: [1, 11],
    temperature: [15, 40],
    humidity: [20, 85],
    wind: [5, 45],
    precipitation: [0, 40],
  }

  cities.forEach(city => {
    parameters.forEach(param => {
      const [min, max] = valueRanges[param]
      const value = getRandomValue(min, max)
      const thresholds = parameterThresholds[param]

      let status: Status
      if (param === 'wqi' || param === 'sqi') {
        // Higher is better for water and soil quality
        if (value >= thresholds.good) status = 'good'
        else if (value >= thresholds.moderate) status = 'moderate'
        else if (value >= thresholds.poor) status = 'poor'
        else status = 'alert'
      } else {
        status = getStatusFromValue(value, thresholds) as Status
      }

      const delta = getRandomValue(-10, 10)

      data.push({
        id: `${city.id}-${param}`,
        cityId: city.id,
        parameter: param,
        value,
        unit: parameterUnits[param],
        status,
        timestamp: new Date(),
        delta24h: delta,
        trend: delta > 0.5 ? 'up' : delta < -0.5 ? 'down' : 'stable',
        sparklineData: generateSparklineData(value),
      })
    })
  })

  return data
}

export function generateChartData(parameter: EnvironmentParameter, timeRange: '24h' | '7d' | '30d') {
  const points = timeRange === '24h' ? 24 : timeRange === '7d' ? 7 : 30
  const data = []
  const baseValue = parameter === 'aqi' ? 70 : parameter === 'temperature' ? 28 : 50

  for (let i = 0; i < points; i++) {
    const variation = (Math.random() - 0.5) * baseValue * 0.3
    const value = Math.max(0, Math.round((baseValue + variation) * 10) / 10)

    let label: string
    if (timeRange === '24h') {
      label = `${String(i).padStart(2, '0')}:00`
    } else if (timeRange === '7d') {
      const date = new Date()
      date.setDate(date.getDate() - (points - 1 - i))
      label = date.toLocaleDateString('en', { weekday: 'short' })
    } else {
      const date = new Date()
      date.setDate(date.getDate() - (points - 1 - i))
      label = date.toLocaleDateString('en', { day: '2-digit', month: 'short' })
    }

    data.push({ time: label, value })
  }

  return data
}
