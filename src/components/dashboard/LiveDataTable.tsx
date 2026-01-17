import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, TrendingUp, TrendingDown, Minus, ExternalLink, ArrowUpDown } from 'lucide-react'
import Badge from '@/components/ui/Badge'
import Input from '@/components/ui/Input'
import { cn } from '@/lib/utils'
import { SensorData } from '@/types'

interface LiveDataTableProps {
  data: SensorData[]
  onRowClick?: (item: SensorData) => void
}

type SortKey = 'cityId' | 'parameter' | 'value' | 'delta24h' | 'status' | 'timestamp'
type SortDirection = 'asc' | 'desc'

export default function LiveDataTable({ data, onRowClick }: LiveDataTableProps) {
  const { t } = useTranslation()
  const [searchQuery, setSearchQuery] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('cityId')
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')
  const [updatedRows, setUpdatedRows] = useState<Set<string>>(new Set())

  // Track updated rows for animation
  useEffect(() => {
    const newUpdated = new Set(data.map(d => d.id))
    setUpdatedRows(newUpdated)
    const timer = setTimeout(() => setUpdatedRows(new Set()), 500)
    return () => clearTimeout(timer)
  }, [data])

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDirection('asc')
    }
  }

  const filteredData = data.filter(item => {
    const cityName = t(`cities.${item.cityId}`).toLowerCase()
    const paramName = t(`home.${item.parameter === 'aqi' ? 'airQuality' : item.parameter === 'wqi' ? 'waterQuality' : item.parameter}`).toLowerCase()
    return cityName.includes(searchQuery.toLowerCase()) || paramName.includes(searchQuery.toLowerCase())
  })

  const sortedData = [...filteredData].sort((a, b) => {
    const modifier = sortDirection === 'asc' ? 1 : -1
    if (sortKey === 'cityId' || sortKey === 'parameter' || sortKey === 'status') {
      return a[sortKey].localeCompare(b[sortKey]) * modifier
    }
    if (sortKey === 'timestamp') {
      return (new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()) * modifier
    }
    return (a[sortKey] - b[sortKey]) * modifier
  })

  const TrendIcon = ({ trend }: { trend: 'up' | 'down' | 'stable' }) => {
    if (trend === 'up') return <TrendingUp className="w-4 h-4 text-red-500" />
    if (trend === 'down') return <TrendingDown className="w-4 h-4 text-green-500" />
    return <Minus className="w-4 h-4 text-muted" />
  }

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const getParamLabel = (param: string) => {
    const labels: Record<string, string> = {
      aqi: 'home.airQuality',
      wqi: 'home.waterQuality',
      sqi: 'home.soilQuality',
      uv: 'home.uvIndex',
      temperature: 'home.temperature',
      humidity: 'home.humidity',
      wind: 'home.wind',
      precipitation: 'home.precipitation',
    }
    return t(labels[param] || param)
  }

  return (
    <div className="bg-surface rounded-2xl border border-border overflow-hidden">
      {/* Search */}
      <div className="p-4 border-b border-border">
        <Input
          icon={<Search className="w-4 h-4" />}
          placeholder={t('common.search')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-xs"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto scrollbar-thin">
        <table className="w-full">
          <thead className="bg-slate-50 dark:bg-slate-800/50">
            <tr>
              {[
                { key: 'cityId', label: t('table.city') },
                { key: 'parameter', label: t('table.parameter') },
                { key: 'value', label: t('table.currentValue') },
                { key: 'delta24h', label: t('table.delta24h') },
                { key: 'status', label: t('table.status') },
                { key: 'timestamp', label: t('table.lastUpdated') },
              ].map(({ key, label }) => (
                <th
                  key={key}
                  onClick={() => handleSort(key as SortKey)}
                  className="px-4 py-3 text-left text-sm font-medium text-muted cursor-pointer hover:text-foreground transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    {label}
                    <ArrowUpDown className={cn('w-3.5 h-3.5', sortKey === key && 'text-primary-500')} />
                  </div>
                </th>
              ))}
              <th className="px-4 py-3 text-left text-sm font-medium text-muted">{t('table.action')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            <AnimatePresence>
              {sortedData.map((item) => (
                <motion.tr
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={cn(
                    'hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors',
                    updatedRows.has(item.id) && 'bg-primary-50/50 dark:bg-primary-900/10'
                  )}
                >
                  <td className="px-4 py-3 text-sm font-medium">{t(`cities.${item.cityId}`)}</td>
                  <td className="px-4 py-3 text-sm">{getParamLabel(item.parameter)}</td>
                  <td className="px-4 py-3">
                    <motion.span
                      key={item.value}
                      initial={{ scale: 1.1, color: '#22c55e' }}
                      animate={{ scale: 1, color: 'inherit' }}
                      className="text-sm font-semibold"
                    >
                      {item.value} {item.unit}
                    </motion.span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <TrendIcon trend={item.trend} />
                      <span className={cn('text-sm', {
                        'text-red-500': item.delta24h > 0,
                        'text-green-500': item.delta24h < 0,
                        'text-muted': item.delta24h === 0,
                      })}>
                        {item.delta24h > 0 ? '+' : ''}{item.delta24h.toFixed(1)}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={item.status} size="sm">
                      {t(`status.${item.status}`)}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted">{formatTime(item.timestamp)}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => onRowClick?.(item)}
                      className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4 text-muted" />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  )
}
