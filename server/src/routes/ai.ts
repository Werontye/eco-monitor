import { Router } from 'express'
import OpenAI from 'openai'

const router = Router()

const SYSTEM_PROMPT = `You are an environmental advisor for Uzbekistan. You provide helpful, accurate information about:
- Air quality and pollution levels
- Water quality and safety
- UV radiation and sun protection
- Weather conditions and forecasts
- Environmental health recommendations
- Eco-friendly plants for monitoring and purification

Keep responses concise (2-3 paragraphs max), practical, and specific to Uzbekistan's environment.
When discussing air quality or weather, mention that data comes from real-time monitoring stations.
Always provide actionable advice when possible.
Respond in the same language as the user's question (Russian, Uzbek, or English).`

router.post('/chat', async (req, res) => {
  const { message, language = 'en' } = req.body
  const apiKey = process.env.OPENAI_API_KEY

  if (!apiKey) {
    return res.status(500).json({ error: 'OpenAI API key not configured' })
  }

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Message is required' })
  }

  try {
    const openai = new OpenAI({ apiKey })

    const languageHint = language === 'ru'
      ? 'Respond in Russian.'
      : language === 'uz'
        ? 'Respond in Uzbek.'
        : 'Respond in English.'

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT + ' ' + languageHint },
        { role: 'user', content: message },
      ],
      max_tokens: 500,
      temperature: 0.7,
    })

    const reply = completion.choices[0]?.message?.content || 'Sorry, I could not generate a response.'

    res.json({
      message: reply,
      timestamp: new Date().toISOString(),
    })
  } catch (error: any) {
    console.error('OpenAI API error:', error)

    if (error.code === 'insufficient_quota') {
      return res.status(429).json({ error: 'API quota exceeded' })
    }

    res.status(500).json({ error: 'Failed to generate AI response' })
  }
})

export { router as aiRouter }
