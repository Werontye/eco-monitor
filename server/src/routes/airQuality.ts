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

// Get AQI status from value (US EPA standard)
function getAqiStatus(aqi: number): string {
  if (aqi <= 50) return 'good'
  if (aqi <= 100) return 'moderate'
  if (aqi <= 150) return 'unhealthy'
  if (aqi <= 200) return 'poor'
  return 'hazardous'
}

// Fetch from IQAir API
async function fetchFromIQAir(lat: number, lon: number, apiKey: string) {
  const response = await fetch(
    `https://api.airvisual.com/v2/nearest_city?lat=${lat}&lon=${lon}&key=${apiKey}`
  )

  if (!response.ok) {
    throw new Error(`IQAir API error: ${response.status}`)
  }

  const data = await response.json()

  if (data.status !== 'success') {
    throw new Error(data.data?.message || 'IQAir API error')
  }

  return data
}

// Fetch from AQICN API (fallback)
async function fetchFromAQICN(lat: number, lon: number, apiKey: string) {
  const response = await fetch(
    `https://api.waqi.info/feed/geo:${lat};${lon}/?token=${apiKey}`
  )

  if (!response.ok) {
    throw new Error(`AQICN API error: ${response.status}`)
  }

  const data = await response.json()

  if (data.status !== 'ok') {
    throw new Error('AQICN data not available')
  }

  return data
}

// Get air quality for a city
router.get('/:cityId', async (req, res) => {
  const { cityId } = req.params
  const iqairKey = process.env.IQAIR_API_KEY
  const aqicnKey = process.env.AQICN_API_KEY

  const coords = cityCoordinates[cityId]
  if (!coords) {
    return res.status(404).json({ error: 'City not found' })
  }

  // Try IQAir first (more accurate for Central Asia)
  if (iqairKey) {
    try {
      const data = await fetchFromIQAir(coords.lat, coords.lon, iqairKey)
      const pollution = data.data.current.pollution
      const aqi = pollution.aqius // US AQI standard

      console.log(`IQAir AQI for ${cityId}: ${aqi} from ${data.data.city}`)

      return res.json({
        cityId,
        aqi,
        status: getAqiStatus(aqi),
        pm25: pollution.mainus === 'p2' ? aqi : undefined,
        station: data.data.city,
        source: 'iqair',
        timestamp: pollution.ts,
      })
    } catch (error) {
      console.error('IQAir API error:', error)
      // Fall through to AQICN
    }
  }

  // Fallback to AQICN
  if (aqicnKey) {
    try {
      const data = await fetchFromAQICN(coords.lat, coords.lon, aqicnKey)
      const aqi = data.data.aqi
      const iaqi = data.data.iaqi || {}

      console.log(`AQICN AQI for ${cityId}: ${aqi} from ${data.data.city?.name}`)

      return res.json({
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
        source: 'aqicn',
        timestamp: data.data.time?.iso || new Date().toISOString(),
      })
    } catch (error) {
      console.error('AQICN API error:', error)
    }
  }

  return res.status(500).json({ error: 'No AQI API configured or available' })
})

// Get air quality for all cities
router.get('/', async (req, res) => {
  const iqairKey = process.env.IQAIR_API_KEY
  const aqicnKey = process.env.AQICN_API_KEY

  if (!iqairKey && !aqicnKey) {
    return res.status(500).json({ error: 'No AQI API key configured' })
  }

  try {
    const results = await Promise.all(
      Object.entries(cityCoordinates).map(async ([cityId, coords]) => {
        // Try IQAir first
        if (iqairKey) {
          try {
            const data = await fetchFromIQAir(coords.lat, coords.lon, iqairKey)
            const aqi = data.data.current.pollution.aqius
            return {
              cityId,
              aqi,
              status: getAqiStatus(aqi),
              source: 'iqair',
            }
          } catch {
            // Fall through to AQICN
          }
        }

        // Fallback to AQICN
        if (aqicnKey) {
          try {
            const data = await fetchFromAQICN(coords.lat, coords.lon, aqicnKey)
            const aqi = data.data.aqi
            return {
              cityId,
              aqi: typeof aqi === 'number' ? aqi : parseInt(aqi) || 0,
              status: getAqiStatus(typeof aqi === 'number' ? aqi : parseInt(aqi) || 0),
              source: 'aqicn',
            }
          } catch {
            return null
          }
        }

        return null
      })
    )

    res.json(results.filter(Boolean))
  } catch (error) {
    console.error('AQI API error:', error)
    res.status(500).json({ error: 'Failed to fetch air quality data' })
  }
})

export { router as airQualityRouter }
