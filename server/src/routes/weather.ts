import { Router } from 'express'

const router = Router()

// City coordinates for Uzbekistan
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

// Get weather data for a city
router.get('/:cityId', async (req, res) => {
  const { cityId } = req.params
  const apiKey = process.env.OPENWEATHER_API_KEY

  if (!apiKey) {
    return res.status(500).json({ error: 'OpenWeather API key not configured' })
  }

  const coords = cityCoordinates[cityId]
  if (!coords) {
    return res.status(404).json({ error: 'City not found' })
  }

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${coords.lat}&lon=${coords.lon}&appid=${apiKey}&units=metric`
    )

    if (!response.ok) {
      throw new Error(`OpenWeather API error: ${response.status}`)
    }

    const data = await response.json()

    res.json({
      cityId,
      temperature: Math.round(data.main.temp * 10) / 10,
      humidity: data.main.humidity,
      wind: Math.round(data.wind.speed * 10) / 10,
      pressure: data.main.pressure,
      description: data.weather[0]?.description,
      icon: data.weather[0]?.icon,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Weather API error:', error)
    res.status(500).json({ error: 'Failed to fetch weather data' })
  }
})

// Get UV index for a city
router.get('/:cityId/uv', async (req, res) => {
  const { cityId } = req.params
  const apiKey = process.env.OPENWEATHER_API_KEY

  if (!apiKey) {
    return res.status(500).json({ error: 'OpenWeather API key not configured' })
  }

  const coords = cityCoordinates[cityId]
  if (!coords) {
    return res.status(404).json({ error: 'City not found' })
  }

  try {
    // Using One Call API for UV data
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${coords.lat}&lon=${coords.lon}&appid=${apiKey}&exclude=minutely,hourly,daily,alerts`
    )

    if (!response.ok) {
      throw new Error(`OpenWeather API error: ${response.status}`)
    }

    const data = await response.json()

    res.json({
      cityId,
      uv: Math.round(data.current.uvi * 10) / 10,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('UV API error:', error)
    res.status(500).json({ error: 'Failed to fetch UV data' })
  }
})

// Get weather for all cities
router.get('/', async (req, res) => {
  const apiKey = process.env.OPENWEATHER_API_KEY

  if (!apiKey) {
    return res.status(500).json({ error: 'OpenWeather API key not configured' })
  }

  try {
    const results = await Promise.all(
      Object.entries(cityCoordinates).map(async ([cityId, coords]) => {
        try {
          const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${coords.lat}&lon=${coords.lon}&appid=${apiKey}&units=metric`
          )

          if (!response.ok) return null

          const data = await response.json()
          return {
            cityId,
            temperature: Math.round(data.main.temp * 10) / 10,
            humidity: data.main.humidity,
            wind: Math.round(data.wind.speed * 10) / 10,
            pressure: data.main.pressure,
          }
        } catch {
          return null
        }
      })
    )

    res.json(results.filter(Boolean))
  } catch (error) {
    console.error('Weather API error:', error)
    res.status(500).json({ error: 'Failed to fetch weather data' })
  }
})

export { router as weatherRouter }
