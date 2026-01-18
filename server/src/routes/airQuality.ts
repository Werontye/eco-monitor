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

// Cache for AQI data (5 minutes TTL)
interface CacheEntry {
  data: AqiData
  timestamp: number
}

interface AqiData {
  cityId: string
  aqi: number
  status: string
  pm25?: number
  pm10?: number
  o3?: number
  no2?: number
  so2?: number
  co?: number
  station?: string
  source: string
  timestamp: string
}

const cache: Map<string, CacheEntry> = new Map()
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

function getCached(cityId: string): AqiData | null {
  const entry = cache.get(cityId)
  if (entry && Date.now() - entry.timestamp < CACHE_TTL) {
    return entry.data
  }
  return null
}

function setCache(cityId: string, data: AqiData): void {
  cache.set(cityId, { data, timestamp: Date.now() })
}

// Get AQI status from value (US EPA standard)
function getAqiStatus(aqi: number): string {
  if (aqi <= 50) return 'good'
  if (aqi <= 100) return 'moderate'
  if (aqi <= 150) return 'unhealthy'
  if (aqi <= 200) return 'poor'
  return 'hazardous'
}

// Delay helper for rate limiting
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
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

// Fetch AQI for a single city with caching
async function fetchCityAqi(cityId: string, coords: { lat: number; lon: number }): Promise<AqiData | null> {
  // Check cache first
  const cached = getCached(cityId)
  if (cached) {
    console.log(`Cache hit for ${cityId}: AQI ${cached.aqi}`)
    return cached
  }

  const iqairKey = process.env.IQAIR_API_KEY
  const aqicnKey = process.env.AQICN_API_KEY

  // Try IQAir first (more accurate for Central Asia)
  if (iqairKey) {
    try {
      const data = await fetchFromIQAir(coords.lat, coords.lon, iqairKey)
      const pollution = data.data.current.pollution
      const aqi = pollution.aqius

      console.log(`IQAir AQI for ${cityId}: ${aqi} from ${data.data.city}`)

      const result: AqiData = {
        cityId,
        aqi,
        status: getAqiStatus(aqi),
        pm25: pollution.mainus === 'p2' ? aqi : undefined,
        station: data.data.city,
        source: 'iqair',
        timestamp: pollution.ts,
      }

      setCache(cityId, result)
      return result
    } catch (error) {
      console.error(`IQAir error for ${cityId}:`, error)
      // Fall through to AQICN
    }
  }

  // Fallback to AQICN
  if (aqicnKey) {
    try {
      const data = await fetchFromAQICN(coords.lat, coords.lon, aqicnKey)
      const aqi = data.data.aqi
      const iaqi = data.data.iaqi || {}
      const aqiNum = typeof aqi === 'number' ? aqi : parseInt(aqi) || 0

      console.log(`AQICN AQI for ${cityId}: ${aqiNum} from ${data.data.city?.name}`)

      const result: AqiData = {
        cityId,
        aqi: aqiNum,
        status: getAqiStatus(aqiNum),
        pm25: iaqi.pm25?.v,
        pm10: iaqi.pm10?.v,
        o3: iaqi.o3?.v,
        no2: iaqi.no2?.v,
        so2: iaqi.so2?.v,
        co: iaqi.co?.v,
        station: data.data.city?.name,
        source: 'aqicn',
        timestamp: data.data.time?.iso || new Date().toISOString(),
      }

      setCache(cityId, result)
      return result
    } catch (error) {
      console.error(`AQICN error for ${cityId}:`, error)
    }
  }

  return null
}

// Get air quality for a city
router.get('/:cityId', async (req, res) => {
  const { cityId } = req.params

  const coords = cityCoordinates[cityId]
  if (!coords) {
    return res.status(404).json({ error: 'City not found' })
  }

  const result = await fetchCityAqi(cityId, coords)

  if (result) {
    return res.json(result)
  }

  return res.status(500).json({ error: 'No AQI API configured or available' })
})

// Get air quality for all cities (with rate limiting)
router.get('/', async (_req, res) => {
  const iqairKey = process.env.IQAIR_API_KEY
  const aqicnKey = process.env.AQICN_API_KEY

  if (!iqairKey && !aqicnKey) {
    return res.status(500).json({ error: 'No AQI API key configured' })
  }

  try {
    const results: AqiData[] = []
    const cities = Object.entries(cityCoordinates)

    // Process cities sequentially with delay to avoid rate limiting
    for (const [cityId, coords] of cities) {
      const result = await fetchCityAqi(cityId, coords)
      if (result) {
        results.push(result)
      }

      // Small delay between requests to avoid rate limiting (only if not cached)
      if (!getCached(cityId)) {
        await delay(200) // 200ms delay between API calls
      }
    }

    res.json(results)
  } catch (error) {
    console.error('AQI API error:', error)
    res.status(500).json({ error: 'Failed to fetch air quality data' })
  }
})

export { router as airQualityRouter }
