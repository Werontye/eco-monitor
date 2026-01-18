import { Router } from 'express'

const router = Router()

// City coordinates for geo-based AQI lookup
const cityCoordinates: Record<string, { lat: number; lon: number }> = {
  tashkent: { lat: 41.2995, lon: 69.2401 },
  samarkand: { lat: 39.6542, lon: 66.9597 },
  bukhara: { lat: 39.7681, lon: 64.4556 },
  namangan: { lat: 40.9983, lon: 71.6726 },
  andijan: { lat: 40.7821, lon: 72.3442 },
  fergana: { lat: 40.3864, lon: 71.7864 },
  nukus: { lat: 42.4619, lon: 59.6166 },
  urgench: { lat: 41.5500, lon: 60.6333 },
  kokand: { lat: 40.5286, lon: 70.9425 },
  navoi: { lat: 40.0844, lon: 65.3792 },
  jizzakh: { lat: 40.1158, lon: 67.8422 },
  termez: { lat: 37.2242, lon: 67.2783 },
  qarshi: { lat: 38.8600, lon: 65.8000 },
  margilan: { lat: 40.4703, lon: 71.7144 },
}

// Get AQI status from value
function getAqiStatus(aqi: number): string {
  if (aqi <= 50) return 'good'
  if (aqi <= 100) return 'moderate'
  if (aqi <= 150) return 'unhealthy'
  if (aqi <= 200) return 'poor'
  return 'hazardous'
}

// Get air quality for a city using geo coordinates
router.get('/:cityId', async (req, res) => {
  const { cityId } = req.params
  const apiKey = process.env.AQICN_API_KEY

  if (!apiKey) {
    return res.status(500).json({ error: 'AQICN API key not configured' })
  }

  const coords = cityCoordinates[cityId]
  if (!coords) {
    return res.status(404).json({ error: 'City not found' })
  }

  try {
    // Use geo-based API endpoint for accurate location data
    const response = await fetch(
      `https://api.waqi.info/feed/geo:${coords.lat};${coords.lon}/?token=${apiKey}`
    )

    if (!response.ok) {
      throw new Error(`AQICN API error: ${response.status}`)
    }

    const data = await response.json()

    if (data.status !== 'ok') {
      return res.status(404).json({ error: 'City data not available' })
    }

    const aqi = data.data.aqi
    const iaqi = data.data.iaqi || {}

    // Log which station we're getting data from
    console.log(`AQI for ${cityId}: ${aqi} from station: ${data.data.city?.name}`)

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
      station: data.data.city?.name,
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
      Object.entries(cityCoordinates).map(async ([cityId, coords]) => {
        try {
          const response = await fetch(
            `https://api.waqi.info/feed/geo:${coords.lat};${coords.lon}/?token=${apiKey}`
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
