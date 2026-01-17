import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Activity, RefreshCw } from 'lucide-react'
import KPICard from '@/components/dashboard/KPICard'
import LiveDataTable from '@/components/dashboard/LiveDataTable'
import UzbekistanMap from '@/components/dashboard/UzbekistanMap'
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import Select from '@/components/ui/Select'
import { generateSensorData } from '@/data/mockData'
import { parameterLabels, parameterUnits, cities } from '@/data/cities'
import { SensorData, KPICardData, EnvironmentParameter } from '@/types'

export default function Home() {
  const { t } = useTranslation()
  const [sensorData, setSensorData] = useState<SensorData[]>([])
  const [selectedCity, setSelectedCity] = useState<string>('tashkent')
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())
  const [isLive, setIsLive] = useState(true)

  // Initial data load
  useEffect(() => {
    setSensorData(generateSensorData())
  }, [])

  // Simulate live updates
  useEffect(() => {
    if (!isLive) return

    const interval = setInterval(() => {
      setSensorData(generateSensorData())
      setLastUpdate(new Date())
    }, 10000) // Update every 10 seconds

    return () => clearInterval(interval)
  }, [isLive])

  const getKPICards = (): KPICardData[] => {
    const cityData = sensorData.filter(d => d.cityId === selectedCity)
    const parameters: EnvironmentParameter[] = ['aqi', 'wqi', 'sqi', 'uv', 'temperature', 'humidity', 'wind', 'precipitation']

    return parameters.map(param => {
      const data = cityData.find(d => d.parameter === param)
      return {
        id: param,
        parameter: param,
        label: parameterLabels[param],
        value: data?.value ?? 0,
        unit: parameterUnits[param],
        status: data?.status ?? 'good',
        trend: data?.trend ?? 'stable',
        delta: data?.delta24h ?? 0,
        sparklineData: data?.sparklineData ?? [],
        icon: param,
      }
    })
  }

  const cityOptions = cities.map(city => ({
    value: city.id,
    label: t(city.nameKey),
  }))

  return (
    <div className="min-h-screen">
      {/* Hero Section with Animated Background */}
      <section className="relative overflow-hidden py-16 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 gradient-animated opacity-10" />
        <div className="relative max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4 pb-1 bg-gradient-to-r from-primary-500 to-primary-700 bg-clip-text text-transparent">
              {t('home.title')}
            </h1>
            <p className="text-xl text-muted max-w-2xl mx-auto">{t('home.subtitle')}</p>
          </motion.div>

          {/* City Selector & Live Status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8"
          >
            <div className="flex items-center gap-4">
              <Select
                options={cityOptions}
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-48"
              />
              <button
                onClick={() => setIsLive(!isLive)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                  isLive
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                    : 'bg-slate-100 dark:bg-slate-800 text-muted'
                }`}
              >
                <Activity className={`w-4 h-4 ${isLive ? 'animate-pulse' : ''}`} />
                <span className="text-sm font-medium">{t('home.liveData')}</span>
              </button>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted">
              <RefreshCw className="w-4 h-4" />
              <span>
                {t('common.lastUpdated')}: {lastUpdate.toLocaleTimeString()}
              </span>
            </div>
          </motion.div>

          {/* KPI Cards Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
          >
            {getKPICards().slice(0, 4).map((card, index) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 * index }}
              >
                <KPICard data={card} />
              </motion.div>
            ))}
          </motion.div>

          {/* Secondary KPI Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
          >
            {getKPICards().slice(4).map((card, index) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 * (index + 4) }}
              >
                <KPICard data={card} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Map and Table Section */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 bg-slate-50/50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Interactive Map */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>{t('home.overview')}</CardTitle>
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

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>{t('cities.' + selectedCity)} - {t('home.overview')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {getKPICards().slice(0, 6).map((card) => (
                      <div
                        key={card.id}
                        className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50"
                      >
                        <span className="text-sm font-medium">{t(card.label)}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold">{card.value}</span>
                          <span className="text-sm text-muted">{card.unit}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Live Data Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className={`w-5 h-5 ${isLive ? 'text-green-500 animate-pulse' : 'text-muted'}`} />
                  {t('home.liveData')}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <LiveDataTable
                  data={sensorData.filter(d => d.parameter === 'aqi' || d.parameter === 'wqi')}
                />
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
