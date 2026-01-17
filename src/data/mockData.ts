import { SensorData, Product, EnvironmentParameter, Status } from '@/types'
import { cities, parameterThresholds, parameterUnits } from './cities'
import { generateSparklineData, getStatusFromValue } from '@/lib/utils'

function getRandomValue(min: number, max: number): number {
  return Math.round((Math.random() * (max - min) + min) * 10) / 10
}

function getRandomStatus(): Status {
  const rand = Math.random()
  if (rand < 0.5) return 'good'
  if (rand < 0.75) return 'moderate'
  if (rand < 0.9) return 'poor'
  return 'alert'
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

export const products: Product[] = [
  {
    id: 'peace-lily',
    name: 'Peace Lily (Spathiphyllum)',
    description: 'Excellent air purifier that removes formaldehyde, benzene, and carbon monoxide. Easy to care for and blooms beautiful white flowers.',
    image: '/images/peace-lily.jpg',
    price: 45000,
    category: 'air',
    monitors: ['Formaldehyde', 'Benzene', 'CO'],
    difficulty: 'easy',
    inStock: true,
  },
  {
    id: 'spider-plant',
    name: 'Spider Plant (Chlorophytum)',
    description: 'NASA-approved air purifier. Removes formaldehyde and xylene. Produces baby plants that can be easily propagated.',
    image: '/images/spider-plant.jpg',
    price: 35000,
    category: 'air',
    monitors: ['Formaldehyde', 'Xylene'],
    difficulty: 'easy',
    inStock: true,
  },
  {
    id: 'snake-plant',
    name: 'Snake Plant (Sansevieria)',
    description: 'One of the best air purifiers. Converts CO2 to oxygen at night. Very drought tolerant and low maintenance.',
    image: '/images/snake-plant.jpg',
    price: 55000,
    category: 'air',
    monitors: ['CO2', 'Formaldehyde', 'Benzene'],
    difficulty: 'easy',
    inStock: true,
  },
  {
    id: 'boston-fern',
    name: 'Boston Fern (Nephrolepis)',
    description: 'Natural humidifier and air purifier. Excellent for removing formaldehyde and adding moisture to dry air.',
    image: '/images/boston-fern.jpg',
    price: 40000,
    category: 'air',
    monitors: ['Formaldehyde', 'Humidity'],
    difficulty: 'medium',
    inStock: true,
  },
  {
    id: 'water-hyacinth',
    name: 'Water Hyacinth (Eichhornia)',
    description: 'Aquatic plant that absorbs heavy metals and nutrients from water. Effective for water purification.',
    image: '/images/water-hyacinth.jpg',
    price: 25000,
    category: 'water',
    monitors: ['Heavy Metals', 'Nitrogen', 'Phosphorus'],
    difficulty: 'easy',
    inStock: true,
  },
  {
    id: 'duckweed',
    name: 'Duckweed (Lemna)',
    description: 'Tiny floating plant that rapidly absorbs nutrients and indicates water quality through growth patterns.',
    image: '/images/duckweed.jpg',
    price: 15000,
    category: 'water',
    monitors: ['Nitrogen', 'Phosphorus', 'pH'],
    difficulty: 'easy',
    inStock: true,
  },
  {
    id: 'water-lettuce',
    name: 'Water Lettuce (Pistia)',
    description: 'Floating plant that filters water and provides habitat for beneficial microorganisms.',
    image: '/images/water-lettuce.jpg',
    price: 20000,
    category: 'water',
    monitors: ['Ammonia', 'Nitrates'],
    difficulty: 'easy',
    inStock: true,
  },
  {
    id: 'lotus',
    name: 'Sacred Lotus (Nelumbo)',
    description: 'Beautiful aquatic plant with excellent water purification properties. Requires more space and care.',
    image: '/images/lotus.jpg',
    price: 75000,
    category: 'water',
    monitors: ['Heavy Metals', 'Water Clarity'],
    difficulty: 'advanced',
    inStock: false,
  },
  {
    id: 'basic-kit',
    name: 'Basic Air Quality Kit',
    description: 'Starter kit with digital air quality monitor and 2 air-purifying plants. Perfect for beginners.',
    image: '/images/basic-kit.jpg',
    price: 150000,
    category: 'kit',
    monitors: ['PM2.5', 'CO2', 'Humidity'],
    difficulty: 'easy',
    inStock: true,
  },
  {
    id: 'advanced-kit',
    name: 'Advanced Environmental Kit',
    description: 'Complete monitoring solution with digital sensors for air and water, plus 4 monitoring plants.',
    image: '/images/advanced-kit.jpg',
    price: 350000,
    category: 'kit',
    monitors: ['PM2.5', 'CO2', 'VOC', 'Water pH', 'TDS'],
    difficulty: 'medium',
    inStock: true,
  },
  {
    id: 'pro-kit',
    name: 'Professional Monitoring Kit',
    description: 'Industrial-grade sensors with mobile app connectivity. Real-time data logging and analysis.',
    image: '/images/pro-kit.jpg',
    price: 750000,
    category: 'kit',
    monitors: ['Full Spectrum Air', 'Water Analysis', 'Soil Testing'],
    difficulty: 'advanced',
    inStock: true,
  },
]

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
