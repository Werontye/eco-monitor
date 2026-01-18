import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Bot, User, Sparkles, Wind, Droplets, Leaf, AlertTriangle } from 'lucide-react'
import Card, { CardContent } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import { ChatMessage } from '@/types'
import { api } from '@/services/api'

const suggestionPrompts = [
  { key: 'air', icon: Wind },
  { key: 'water', icon: Droplets },
  { key: 'plants', icon: Leaf },
  { key: 'health', icon: AlertTriangle },
]

// Simulated AI responses
const aiResponses: Record<string, string> = {
  air: `Based on current data, air quality in Tashkent is **Moderate** with an AQI of 78.

**Key factors:**
- PM2.5 levels are slightly elevated
- Traffic emissions are the main contributor
- Conditions improve in the evening hours

**Recommendations:**
1. Limit outdoor activities during peak traffic (8-10 AM, 5-7 PM)
2. Keep windows closed during high pollution periods
3. Consider using air purifiers indoors
4. Monitor updates for any alerts`,

  water: `To improve water quality in your area, here are actionable steps:

**At Home:**
1. Install a multi-stage water filter
2. Regular maintenance of pipes and tanks
3. Store water in food-grade containers

**Community Level:**
1. Report water quality issues to local authorities
2. Support watershed protection initiatives
3. Participate in river cleanup programs

**Plants that help:**
- Water Hyacinth (absorbs heavy metals)
- Duckweed (indicates nutrient levels)
- Water Lettuce (natural filtration)`,

  plants: `Here are the best bio-indicator plants for monitoring air pollution:

**Indoor Plants:**
1. **Peace Lily** - Sensitive to formaldehyde, shows wilting
2. **Spider Plant** - Leaf tip browning indicates VOCs
3. **Snake Plant** - Browning edges suggest CO2 buildup

**Outdoor Plants:**
1. **Lichens** - Absence indicates sulfur dioxide
2. **Moss** - Discoloration shows acid rain exposure
3. **Pine Trees** - Needle damage from ozone

**How to use:**
- Place plants in different areas
- Monitor leaf condition weekly
- Compare with air quality readings`,

  health: `Current outdoor exercise safety assessment for Tashkent:

**Overall Status: MODERATE CAUTION**

**Safe Activities:**
- Early morning walks (before 8 AM)
- Indoor gym workouts
- Evening light exercise (after 7 PM)

**Not Recommended:**
- High-intensity outdoor cardio
- Running during midday
- Outdoor sports during peak hours

**Protection Tips:**
1. Check AQI before going out
2. Wear N95 mask if AQI > 100
3. Stay hydrated
4. Choose routes away from traffic`,
}

export default function AIAdvisory() {
  const { t, i18n } = useTranslation()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const chatContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Scroll only within the chat container, not the whole page
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [messages])

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsTyping(true)

    let responseContent = ''

    try {
      // Always try real API first
      const response = await api.chat(content, i18n.language)
      responseContent = response.message
    } catch (error) {
      console.error('AI API error:', error)
      // Fallback to mock on error
      await new Promise(resolve => setTimeout(resolve, 1000))
      responseContent = getMockResponse(content)
    }

    const assistantMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: responseContent,
      timestamp: new Date(),
    }

    setIsTyping(false)
    setMessages(prev => [...prev, assistantMessage])
  }

  const getMockResponse = (content: string): string => {
    const lowerContent = content.toLowerCase()

    if (lowerContent.includes('air') || lowerContent.includes('aqi') || lowerContent.includes('воздух') || lowerContent.includes('havo')) {
      return aiResponses.air
    } else if (lowerContent.includes('water') || lowerContent.includes('вода') || lowerContent.includes('suv')) {
      return aiResponses.water
    } else if (lowerContent.includes('plant') || lowerContent.includes('растен') || lowerContent.includes('osimlik')) {
      return aiResponses.plants
    } else if (lowerContent.includes('exercise') || lowerContent.includes('health') || lowerContent.includes('safe') || lowerContent.includes('спорт') || lowerContent.includes('sport')) {
      return aiResponses.health
    }

    return `I understand you're asking about "${content}".

Based on current environmental data, I recommend:

1. **Check the Dashboard** for real-time metrics
2. **Use the Monitoring page** for detailed analysis
3. **Explore Data & Analysis** for historical trends

Is there something specific about air quality, water quality, or health recommendations I can help you with?`
  }

  const handleSuggestionClick = (key: string) => {
    const prompt = t(`ai.suggestions.${key}`)
    handleSendMessage(prompt)
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-2">{t('ai.title')}</h1>
          <p className="text-muted">{t('ai.subtitle')}</p>
        </motion.div>

        {/* Chat Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="mb-4">
            <CardContent className="p-0">
              {/* Messages */}
              <div ref={chatContainerRef} className="h-[500px] overflow-y-auto p-6 space-y-4 scrollbar-thin" style={{ overscrollBehavior: 'contain' }}>
                {messages.length === 0 && (
                  <div className="text-center py-12">
                    <Bot className="w-16 h-16 mx-auto text-muted mb-4" />
                    <p className="text-muted">{t('ai.placeholder')}</p>
                  </div>
                )}

                <AnimatePresence>
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className={cn(
                        'flex gap-3',
                        message.role === 'user' ? 'flex-row-reverse' : ''
                      )}
                    >
                      <div
                        className={cn(
                          'flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center',
                          message.role === 'user'
                            ? 'bg-primary-500'
                            : 'bg-slate-200 dark:bg-slate-700'
                        )}
                      >
                        {message.role === 'user' ? (
                          <User className="w-4 h-4 text-white" />
                        ) : (
                          <Bot className="w-4 h-4" />
                        )}
                      </div>
                      <div
                        className={cn(
                          'max-w-[80%] rounded-2xl px-4 py-3',
                          message.role === 'user'
                            ? 'bg-primary-500 text-white'
                            : 'bg-slate-100 dark:bg-slate-800'
                        )}
                      >
                        <div
                          className={cn(
                            'text-sm prose prose-sm max-w-none',
                            message.role === 'user' ? 'prose-invert' : 'dark:prose-invert'
                          )}
                          dangerouslySetInnerHTML={{
                            __html: message.content
                              .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                              .replace(/\n/g, '<br />')
                          }}
                        />
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* Typing Indicator */}
                <AnimatePresence>
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex gap-3"
                    >
                      <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                        <Bot className="w-4 h-4" />
                      </div>
                      <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl px-4 py-3">
                        <div className="flex gap-1">
                          <motion.div
                            animate={{ y: [0, -5, 0] }}
                            transition={{ repeat: Infinity, duration: 0.6, delay: 0 }}
                            className="w-2 h-2 rounded-full bg-slate-400"
                          />
                          <motion.div
                            animate={{ y: [0, -5, 0] }}
                            transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }}
                            className="w-2 h-2 rounded-full bg-slate-400"
                          />
                          <motion.div
                            animate={{ y: [0, -5, 0] }}
                            transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }}
                            className="w-2 h-2 rounded-full bg-slate-400"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="border-t border-border p-4">
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    handleSendMessage(inputValue)
                  }}
                  className="flex gap-3"
                >
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder={t('ai.placeholder')}
                    className="flex-1 px-4 py-3 rounded-xl border border-border bg-surface focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                    disabled={isTyping}
                  />
                  <Button type="submit" disabled={!inputValue.trim() || isTyping}>
                    <Send className="w-4 h-4" />
                  </Button>
                </form>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Suggestions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3"
        >
          {suggestionPrompts.map(({ key, icon: Icon }) => (
            <button
              key={key}
              onClick={() => handleSuggestionClick(key)}
              disabled={isTyping}
              className="flex items-center gap-2 p-3 rounded-xl bg-surface border border-border hover:border-primary-300 dark:hover:border-primary-700 transition-all text-left disabled:opacity-50"
            >
              <Icon className="w-5 h-5 text-primary-500 flex-shrink-0" />
              <span className="text-sm line-clamp-2">{t(`ai.suggestions.${key}`)}</span>
            </button>
          ))}
        </motion.div>

        {/* Disclaimer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center text-xs text-muted mt-6"
        >
          {t('ai.disclaimer')}
        </motion.p>
      </div>
    </div>
  )
}
