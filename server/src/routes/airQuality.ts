import { Router } from 'express'

const router = Router()

// City names for AQICN API
const cityNames: Record<string, string> = {
  tashkent: 'tashkent',
  samarkand: 'samarkand',
  bukhara: 'bukhara',
  namangan: 'namangan',
  andijan: 'andijan',
  fergana: 'fergana',
  nukus: 'nukus',
  urgench: 'urgench',
  kokand: 'kokand',
  navoi: 'navoi',
  jizzakh: 'jizzakh',
  termez: 'termez',
  qarshi: 'qarshi',
  margilan: 'margilan',
}

// Get AQI status from value
function getAqiStatus(aqi: number): string {
  if (aqi <= 50) return 'good'
  if (aqi <= 100) return 'moderate'
  if (aqi <= 150) return 'unhealthy'
  if (aqi <= 200) return 'poor'
  return 'hazardous'
}

// Get air quality for a city
router.get('/:cityId', async (req, res) => {
  const { cityId } = req.params
  const apiKey = process.env.AQICN_API_KEY

  if (!apiKey) {
    return res.status(500).json({ error: 'AQICN API key not configured' })
  }

  const cityName = cityNames[cityId]
  if (!cityName) {
    return res.status(404).json({ error: 'City not found' })
  }

  try {
    const response = await fetch(
      `https://api.waqi.info/feed/${cityName}/?token=${apiKey}`
    )

    if (!response.ok) {
      throw new Error(`AQICN API error: ${response.status}`)
    }

    const data = await response.json()

    if (data.status !== 'ok') {
      // Try with geo coordinates as fallback
      return res.status(404).json({ error: 'City data not available' })
    }

    const aqi = data.data.aqi
    const iaqi = data.data.iaqi || {}

    res.json({
      cityId,
      aqi: typeof aqi === 'number' ? aqi : parseInt(aqi) || 0,
      status: getAqiStatus(typeof aqi === 'number' ? aqi : parseInt(aqi) || 0),
      pm25: iaqi.pm25?.v,
      pm10: iaqi.pm10?.v,
      o3: iaqi.o3?.v,
      no2: iaqi.no2?.v,
      so2: iaqi.so2?.v,
      co: iaqi.co?.v,
      timestamp: data.data.time?.iso || new Date().toISOString(),
    })
  } catch (error) {
    console.error('AQI API error:', error)
    res.status(500).json({ error: 'Failed to fetch air quality data' })
  }
})

// Get air quality for all cities
router.get('/', async (req, res) => {
  const apiKey = process.env.AQICN_API_KEY

  if (!apiKey) {
    return res.status(500).json({ error: 'AQICN API key not configured' })
  }

  try {
    const results = await Promise.all(
      Object.entries(cityNames).map(async ([cityId, cityName]) => {
        try {
          const response = await fetch(
            `https://api.waqi.info/feed/${cityName}/?token=${apiKey}`
          )

          if (!response.ok) return null

          const data = await response.json()
          if (data.status !== 'ok') return null

          const aqi = data.data.aqi
          return {
            cityId,
            aqi: typeof aqi === 'number' ? aqi : parseInt(aqi) || 0,
            status: getAqiStatus(typeof aqi === 'number' ? aqi : parseInt(aqi) || 0),
          }
        } catch {
          return null
        }
      })
    )

    res.json(results.filter(Boolean))
  } catch (error) {
    console.error('AQI API error:', error)
    res.status(500).json({ error: 'Failed to fetch air quality data' })
  }
})

export { router as airQualityRouter }
