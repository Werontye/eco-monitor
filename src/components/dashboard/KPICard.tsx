import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { TrendingUp, TrendingDown, Minus, Wind, Droplets, Thermometer, Sun, Leaf, CloudRain, Gauge } from 'lucide-react'
import { LineChart, Line, ResponsiveContainer } from 'recharts'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import { cn } from '@/lib/utils'
import { KPICardData, Status } from '@/types'

const icons: Record<string, React.ComponentType<{ className?: string }>> = {
  aqi: Wind,
  wqi: Droplets,
  sqi: Leaf,
  uv: Sun,
  temperature: Thermometer,
  humidity: Droplets,
  wind: Wind,
  precipitation: CloudRain,
}

interface KPICardProps {
  data: KPICardData
  animate?: boolean
}

export default function KPICard({ data, animate = true }: KPICardProps) {
  const { t } = useTranslation()
  const [prevValue, setPrevValue] = useState(data.value)
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    if (data.value !== prevValue) {
      setIsUpdating(true)
      const timer = setTimeout(() => {
        setPrevValue(data.value)
        setIsUpdating(false)
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [data.value, prevValue])

  const Icon = icons[data.parameter] || Gauge
  const TrendIcon = data.trend === 'up' ? TrendingUp : data.trend === 'down' ? TrendingDown : Minus

  const statusColors: Record<Status, string> = {
    good: 'text-green-500',
    moderate: 'text-yellow-500',
    poor: 'text-orange-500',
    alert: 'text-red-500',
  }

  const sparklineColor: Record<Status, string> = {
    good: '#22c55e',
    moderate: '#eab308',
    poor: '#f97316',
    alert: '#ef4444',
  }

  const chartData = data.sparklineData.map((value, i) => ({ value, index: i }))

  // Helper function for trend color to avoid duplicate keys
  const getTrendColor = (trend: 'up' | 'down' | 'stable', parameter: string): string => {
    const isQualityIndex = parameter === 'wqi' || parameter === 'sqi'
    if (trend === 'stable') return 'text-muted'
    if (isQualityIndex) {
      return trend === 'up' ? 'text-green-500' : 'text-red-500'
    }
    return trend === 'down' ? 'text-green-500' : 'text-red-500'
  }

  return (
    <Card hover className="relative overflow-hidden">
      {/* Pulse effect on update */}
      <AnimatePresence>
        {isUpdating && animate && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.5, scale: 1.5 }}
            exit={{ opacity: 0 }}
            className={cn('absolute inset-0 rounded-2xl', {
              'bg-green-500/20': data.status === 'good',
              'bg-yellow-500/20': data.status === 'moderate',
              'bg-orange-500/20': data.status === 'poor',
              'bg-red-500/20': data.status === 'alert',
            })}
          />
        )}
      </AnimatePresence>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className={cn('p-2.5 rounded-xl', {
            'bg-green-100 dark:bg-green-900/30': data.status === 'good',
            'bg-yellow-100 dark:bg-yellow-900/30': data.status === 'moderate',
            'bg-orange-100 dark:bg-orange-900/30': data.status === 'poor',
            'bg-red-100 dark:bg-red-900/30': data.status === 'alert',
          })}>
            <Icon className={cn('w-5 h-5', statusColors[data.status])} />
          </div>
          <Badge variant={data.status} size="sm">
            {t(`status.${data.status}`)}
          </Badge>
        </div>

        {/* Value */}
        <div className="mb-4">
          <p className="text-sm text-muted mb-1">{t(data.label)}</p>
          <div className="flex items-baseline gap-2">
            <motion.span
              key={data.value}
              initial={animate ? { opacity: 0, y: -10 } : false}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl font-bold"
            >
              {data.value}
            </motion.span>
            <span className="text-sm text-muted">{data.unit}</span>
          </div>
        </div>

        {/* Trend & Delta */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1.5">
            <TrendIcon className={cn('w-4 h-4', getTrendColor(data.trend, data.parameter))} />
            <span className="text-sm text-muted">
              {data.delta > 0 ? '+' : ''}{data.delta.toFixed(1)} {t('home.trend24h')}
            </span>
          </div>
        </div>

        {/* Sparkline */}
        <div className="h-12 -mx-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <Line
                type="monotone"
                dataKey="value"
                stroke={sparklineColor[data.status]}
                strokeWidth={2}
                dot={false}
                isAnimationActive={animate}
                animationDuration={1000}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  )
}
