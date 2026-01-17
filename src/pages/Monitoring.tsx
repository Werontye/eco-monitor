import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Wind, Droplets, Leaf, Sun, CloudRain, MapPin } from 'lucide-react'
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/Tabs'
import Select from '@/components/ui/Select'
import EnvironmentChart from '@/components/charts/EnvironmentChart'
import UzbekistanMap from '@/components/dashboard/UzbekistanMap'
import { generateSensorData, generateChartData } from '@/data/mockData'
import { cities } from '@/data/cities'
import { SensorData, EnvironmentParameter, TimeRange } from '@/types'
import { cn } from '@/lib/utils'

const monitoringCategories = [
  { id: 'air', labelKey: 'monitoring.air', icon: Wind, color: '#3b82f6' },
  { id: 'water', labelKey: 'monitoring.water', icon: Droplets, color: '#06b6d4' },
  { id: 'soil', labelKey: 'monitoring.soil', icon: Leaf, color: '#84cc16' },
  { id: 'uv', labelKey: 'monitoring.uv', icon: Sun, color: '#f59e0b' },
  { id: 'weather', labelKey: 'monitoring.weather', icon: CloudRain, color: '#8b5cf6' },
]

const timeRanges: TimeRange[] = [
  { value: '24h', label: 'monitoring.24h' },
  { value: '7d', label: 'monitoring.7d' },
  { value: '30d', label: 'monitoring.30d' },
]

export default function Monitoring() {
  const { t } = useTranslation()
  const [activeCategory, setActiveCategory] = useState('air')
  const [selectedCity, setSelectedCity] = useState('tashkent')
  const [compareCity, setCompareCity] = useState<string | null>(null)
  const [timeRange, setTimeRange] = useState<TimeRange['value']>('24h')
  const [sensorData, setSensorData] = useState<SensorData[]>([])

  useEffect(() => {
    setSensorData(generateSensorData())
  }, [])

  const getParameterForCategory = (category: string): EnvironmentParameter => {
    const mapping: Record<string, EnvironmentParameter> = {
      air: 'aqi',
      water: 'wqi',
      soil: 'sqi',
      uv: 'uv',
      weather: 'temperature',
    }
    return mapping[category] || 'aqi'
  }

  const getCategoryColor = (category: string): string => {
    return monitoringCategories.find(c => c.id === category)?.color || '#22c55e'
  }

  const cityOptions = cities.map(city => ({
    value: city.id,
    label: t(city.nameKey),
  }))

  const chartData = generateChartData(getParameterForCategory(activeCategory), timeRange)
  const compareChartData = compareCity ? generateChartData(getParameterForCategory(activeCategory), timeRange) : null

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-2">{t('monitoring.title')}</h1>
          <p className="text-muted">
            {t('home.subtitle')}
          </p>
        </motion.div>

        {/* Category Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex flex-wrap gap-2">
            {monitoringCategories.map((category) => {
              const Icon = category.icon
              const isActive = activeCategory === category.id
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all',
                    isActive
                      ? 'text-white shadow-lg'
                      : 'bg-surface border border-border hover:border-primary-300 dark:hover:border-primary-700'
                  )}
                  style={isActive ? { backgroundColor: category.color } : {}}
                >
                  <Icon className="w-5 h-5" />
                  {t(category.labelKey)}
                </button>
              )
            })}
          </div>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
        >
          <Select
            label={t('home.selectCity')}
            options={cityOptions}
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
          />

          <Select
            label={t('monitoring.compare')}
            options={[{ value: '', label: '-' }, ...cityOptions.filter(c => c.value !== selectedCity)]}
            value={compareCity || ''}
            onChange={(e) => setCompareCity(e.target.value || null)}
          />

          <div>
            <label className="block text-sm font-medium mb-1.5">{t('monitoring.timeRange')}</label>
            <Tabs defaultValue={timeRange} onChange={(v) => setTimeRange(v as TimeRange['value'])}>
              <TabsList className="w-full">
                {timeRanges.map((range) => (
                  <TabsTrigger key={range.value} value={range.value} className="flex-1">
                    {t(range.label)}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        </motion.div>

        {/* Main Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {(() => {
                  const category = monitoringCategories.find(c => c.id === activeCategory)
                  const Icon = category?.icon || Wind
                  return <Icon className="w-5 h-5" style={{ color: category?.color }} />
                })()}
                {t(`monitoring.${activeCategory}`)} - {t(`cities.${selectedCity}`)}
                {compareCity && ` vs ${t(`cities.${compareCity}`)}`}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <EnvironmentChart
                data={chartData}
                type="area"
                color={getCategoryColor(activeCategory)}
                height={400}
                secondaryData={
                  compareCity && compareChartData
                    ? {
                        data: compareChartData,
                        dataKey: 'value',
                        color: '#94a3b8',
                        name: t(`cities.${compareCity}`),
                      }
                    : undefined
                }
              />
            </CardContent>
          </Card>
        </motion.div>

        {/* Map and Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Sensor Map */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  {t('monitoring.sensors')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <UzbekistanMap
                  sensorData={sensorData}
                  selectedCity={selectedCity}
                  onCitySelect={setSelectedCity}
                />
              </CardContent>
            </Card>
          </motion.div>

          {/* City Comparison */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="h-full">
              <CardHeader>
                <CardTitle>{t('monitoring.compare')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {cities.slice(0, 8).map((city) => {
                    const cityData = sensorData.find(
                      d => d.cityId === city.id && d.parameter === getParameterForCategory(activeCategory)
                    )
                    const maxValue = activeCategory === 'air' ? 200 : activeCategory === 'uv' ? 11 : 100
                    const percentage = cityData ? (cityData.value / maxValue) * 100 : 0

                    return (
                      <button
                        key={city.id}
                        onClick={() => setSelectedCity(city.id)}
                        className={cn(
                          'w-full p-3 rounded-xl transition-all text-left',
                          selectedCity === city.id
                            ? 'bg-primary-100 dark:bg-primary-900/30 ring-2 ring-primary-500'
                            : 'bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800'
                        )}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-sm">{t(city.nameKey)}</span>
                          <span className="text-sm font-semibold">
                            {cityData?.value ?? '-'} {cityData?.unit}
                          </span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(percentage, 100)}%` }}
                            transition={{ duration: 0.5 }}
                            className="h-full rounded-full"
                            style={{ backgroundColor: getCategoryColor(activeCategory) }}
                          />
                        </div>
                      </button>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
