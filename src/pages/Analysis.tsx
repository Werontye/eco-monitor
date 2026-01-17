import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { BarChart3, LineChart, PieChart, Download, TrendingUp, Calculator } from 'lucide-react'
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/Tabs'
import Select from '@/components/ui/Select'
import Button from '@/components/ui/Button'
import EnvironmentChart from '@/components/charts/EnvironmentChart'
import { generateChartData } from '@/data/mockData'
import { cities, parameterUnits } from '@/data/cities'
import { EnvironmentParameter } from '@/types'
import { cn } from '@/lib/utils'

const parameters: { value: EnvironmentParameter; labelKey: string }[] = [
  { value: 'aqi', labelKey: 'home.airQuality' },
  { value: 'wqi', labelKey: 'home.waterQuality' },
  { value: 'sqi', labelKey: 'home.soilQuality' },
  { value: 'uv', labelKey: 'home.uvIndex' },
  { value: 'temperature', labelKey: 'home.temperature' },
  { value: 'humidity', labelKey: 'home.humidity' },
]

export default function Analysis() {
  const { t } = useTranslation()
  const [selectedCities, setSelectedCities] = useState<string[]>(['tashkent', 'samarkand'])
  const [selectedParameter, setSelectedParameter] = useState<EnvironmentParameter>('aqi')
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d'>('7d')
  const [chartType, setChartType] = useState<'line' | 'area' | 'bar'>('area')

  const cityOptions = cities.map(city => ({
    value: city.id,
    label: t(city.nameKey),
  }))

  const parameterOptions = parameters.map(p => ({
    value: p.value,
    label: t(p.labelKey),
  }))

  const chartData = generateChartData(selectedParameter, timeRange)

  // Calculate statistics
  const calculateStats = () => {
    const values = chartData.map(d => d.value)
    const sorted = [...values].sort((a, b) => a - b)
    const sum = values.reduce((a, b) => a + b, 0)
    const avg = sum / values.length
    const median = sorted[Math.floor(sorted.length / 2)]
    const peak = Math.max(...values)
    const min = Math.min(...values)
    const trend = values[values.length - 1] - values[0]

    return { avg, median, peak, min, trend }
  }

  const stats = calculateStats()

  const handleExport = (format: 'csv' | 'json') => {
    const exportData = {
      parameter: selectedParameter,
      timeRange,
      cities: selectedCities,
      data: chartData,
      statistics: stats,
      exportedAt: new Date().toISOString(),
    }

    if (format === 'json') {
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `eco-monitor-data-${selectedParameter}-${timeRange}.json`
      a.click()
    } else {
      const headers = ['Time', 'Value']
      const rows = chartData.map(d => `${d.time},${d.value}`)
      const csv = [headers.join(','), ...rows].join('\n')
      const blob = new Blob([csv], { type: 'text/csv' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `eco-monitor-data-${selectedParameter}-${timeRange}.csv`
      a.click()
    }
  }

  const StatCard = ({ label, value, unit, icon: Icon }: {
    label: string
    value: number
    unit?: string
    icon: React.ComponentType<{ className?: string }>
  }) => (
    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
      <div className="flex items-center gap-2 mb-2">
        <Icon className="w-4 h-4 text-muted" />
        <span className="text-sm text-muted">{label}</span>
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-bold">{value.toFixed(1)}</span>
        {unit && <span className="text-sm text-muted">{unit}</span>}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-2">{t('analysis.title')}</h1>
          <p className="text-muted">{t('home.subtitle')}</p>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
        >
          <Select
            label={t('table.parameter')}
            options={parameterOptions}
            value={selectedParameter}
            onChange={(e) => setSelectedParameter(e.target.value as EnvironmentParameter)}
          />

          <Select
            label={t('home.selectCity')}
            options={cityOptions}
            value={selectedCities[0]}
            onChange={(e) => setSelectedCities([e.target.value, ...selectedCities.slice(1)])}
          />

          <div>
            <label className="block text-sm font-medium mb-1.5">{t('monitoring.timeRange')}</label>
            <Tabs defaultValue={timeRange} onChange={(v) => setTimeRange(v as '24h' | '7d' | '30d')}>
              <TabsList className="w-full">
                <TabsTrigger value="24h" className="flex-1">24h</TabsTrigger>
                <TabsTrigger value="7d" className="flex-1">7d</TabsTrigger>
                <TabsTrigger value="30d" className="flex-1">30d</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">{t('analysis.charts')}</label>
            <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
              {[
                { type: 'line', icon: LineChart },
                { type: 'area', icon: BarChart3 },
                { type: 'bar', icon: PieChart },
              ].map(({ type, icon: Icon }) => (
                <button
                  key={type}
                  onClick={() => setChartType(type as 'line' | 'area' | 'bar')}
                  className={cn(
                    'flex-1 p-2 rounded-lg transition-all',
                    chartType === type
                      ? 'bg-surface shadow-sm'
                      : 'hover:bg-white/50 dark:hover:bg-slate-700/50'
                  )}
                >
                  <Icon className="w-4 h-4 mx-auto" />
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Statistics Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8"
        >
          <StatCard
            label={t('analysis.average')}
            value={stats.avg}
            unit={parameterUnits[selectedParameter]}
            icon={Calculator}
          />
          <StatCard
            label={t('analysis.median')}
            value={stats.median}
            unit={parameterUnits[selectedParameter]}
            icon={BarChart3}
          />
          <StatCard
            label={t('analysis.peak')}
            value={stats.peak}
            unit={parameterUnits[selectedParameter]}
            icon={TrendingUp}
          />
          <StatCard
            label="Min"
            value={stats.min}
            unit={parameterUnits[selectedParameter]}
            icon={TrendingUp}
          />
          <StatCard
            label={t('analysis.trend')}
            value={stats.trend}
            icon={TrendingUp}
          />
        </motion.div>

        {/* Main Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <Card>
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle>{t('analysis.charts')}</CardTitle>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleExport('csv')}
                >
                  <Download className="w-4 h-4 mr-1" />
                  {t('analysis.exportCSV')}
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleExport('json')}
                >
                  <Download className="w-4 h-4 mr-1" />
                  {t('analysis.exportJSON')}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <EnvironmentChart
                data={chartData}
                type={chartType}
                color="#22c55e"
                height={400}
              />
            </CardContent>
          </Card>
        </motion.div>

        {/* Correlation Analysis */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>{t('analysis.correlation')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-medium mb-4">{t('home.airQuality')} vs {t('home.temperature')}</h4>
                  <EnvironmentChart
                    data={generateChartData('aqi', timeRange)}
                    type="line"
                    color="#3b82f6"
                    height={250}
                    secondaryData={{
                      data: generateChartData('temperature', timeRange),
                      dataKey: 'value',
                      color: '#f59e0b',
                      name: t('home.temperature'),
                    }}
                  />
                </div>
                <div>
                  <h4 className="font-medium mb-4">{t('home.humidity')} vs {t('home.precipitation')}</h4>
                  <EnvironmentChart
                    data={generateChartData('humidity', timeRange)}
                    type="line"
                    color="#06b6d4"
                    height={250}
                    secondaryData={{
                      data: generateChartData('precipitation', timeRange),
                      dataKey: 'value',
                      color: '#8b5cf6',
                      name: t('home.precipitation'),
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
