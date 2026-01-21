import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import {
  Target,
  Database,
  Shield,
  Mail,
  Send,
  CheckCircle,
  Wind,
  Droplets,
  ThermometerSun,
  MapPin,
  Brain,
  BarChart3,
  Leaf,
  Bell,
  Globe,
  Smartphone,
  Clock,
  LineChart
} from 'lucide-react'
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { cn } from '@/lib/utils'

// Main features of the platform
const platformFeatures = [
  {
    icon: Wind,
    titleKey: 'about.features.airQuality.title',
    descKey: 'about.features.airQuality.desc',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Droplets,
    titleKey: 'about.features.waterQuality.title',
    descKey: 'about.features.waterQuality.desc',
    color: 'from-cyan-500 to-teal-500',
  },
  {
    icon: ThermometerSun,
    titleKey: 'about.features.weather.title',
    descKey: 'about.features.weather.desc',
    color: 'from-orange-500 to-yellow-500',
  },
  {
    icon: MapPin,
    titleKey: 'about.features.map.title',
    descKey: 'about.features.map.desc',
    color: 'from-green-500 to-emerald-500',
  },
  {
    icon: Brain,
    titleKey: 'about.features.ai.title',
    descKey: 'about.features.ai.desc',
    color: 'from-purple-500 to-pink-500',
  },
  {
    icon: BarChart3,
    titleKey: 'about.features.analytics.title',
    descKey: 'about.features.analytics.desc',
    color: 'from-indigo-500 to-purple-500',
  },
]

// Key benefits
const benefits = [
  { icon: Clock, textKey: 'about.benefits.realtime' },
  { icon: Globe, textKey: 'about.benefits.coverage' },
  { icon: Smartphone, textKey: 'about.benefits.accessible' },
  { icon: LineChart, textKey: 'about.benefits.historical' },
  { icon: Bell, textKey: 'about.benefits.alerts' },
  { icon: Leaf, textKey: 'about.benefits.eco' },
]

// Core values
const coreValues = [
  {
    icon: Target,
    titleKey: 'about.mission',
    descKey: 'about.missionText',
    color: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
  },
  {
    icon: Database,
    titleKey: 'about.dataSources',
    descKey: 'about.dataSourcesText',
    color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
  },
  {
    icon: Shield,
    titleKey: 'about.methodology',
    descKey: 'about.methodologyText',
    color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
  },
]

// Statistics
const stats = [
  { value: '14+', labelKey: 'about.stats.cities' },
  { value: '8', labelKey: 'about.stats.parameters' },
  { value: '24/7', labelKey: 'about.stats.monitoring' },
  { value: '5min', labelKey: 'about.stats.updates' },
]

export default function About() {
  const { t } = useTranslation()
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' })
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setTimeout(() => {
      setIsSubmitted(true)
      setContactForm({ name: '', email: '', message: '' })
    }, 500)
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-transparent to-cyan-500/10" />
        <div className="relative max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary-500 to-cyan-500 bg-clip-text text-transparent">
              {t('about.title')}
            </h1>
            <p className="text-xl text-muted max-w-3xl mx-auto mb-8">
              {t('about.subtitle')}
            </p>
            <p className="text-lg text-muted/80 max-w-2xl mx-auto">
              {t('about.heroDescription')}
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12"
          >
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary-500 mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-muted">{t(stat.labelKey)}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Platform Features */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-50/50 dark:bg-slate-900/50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">{t('about.featuresTitle')}</h2>
            <p className="text-muted max-w-2xl mx-auto">{t('about.featuresSubtitle')}</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {platformFeatures.map((feature, index) => (
              <motion.div
                key={feature.titleKey}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className={cn(
                      'w-14 h-14 rounded-2xl flex items-center justify-center mb-4 bg-gradient-to-br',
                      feature.color
                    )}>
                      <feature.icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{t(feature.titleKey)}</h3>
                    <p className="text-sm text-muted">{t(feature.descKey)}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">{t('about.benefitsTitle')}</h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-3 gap-4"
          >
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-4 rounded-xl bg-surface border border-border"
              >
                <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
                  <benefit.icon className="w-5 h-5 text-primary-500" />
                </div>
                <span className="text-sm font-medium">{t(benefit.textKey)}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-50/50 dark:bg-slate-900/50">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {coreValues.map((feature, index) => (
              <motion.div
                key={feature.titleKey}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.1 }}
              >
                <Card className="h-full text-center">
                  <CardContent className="pt-6">
                    <div className={cn('w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4', feature.color)}>
                      <feature.icon className="w-7 h-7" />
                    </div>
                    <h3 className="text-lg font-semibold mb-3">{t(feature.titleKey)}</h3>
                    <p className="text-sm text-muted">{t(feature.descKey)}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>{t('about.howWeCollect')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {[
                    { step: 1, titleKey: 'about.steps.sensors', descKey: 'about.steps.sensorsDesc' },
                    { step: 2, titleKey: 'about.steps.processing', descKey: 'about.steps.processingDesc' },
                    { step: 3, titleKey: 'about.steps.analysis', descKey: 'about.steps.analysisDesc' },
                    { step: 4, titleKey: 'about.steps.delivery', descKey: 'about.steps.deliveryDesc' },
                  ].map((item) => (
                    <div key={item.step} className="text-center">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-cyan-500 flex items-center justify-center mx-auto mb-3">
                        <span className="text-lg font-bold text-white">{item.step}</span>
                      </div>
                      <h4 className="font-medium mb-1">{t(item.titleKey)}</h4>
                      <p className="text-sm text-muted">{t(item.descKey)}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Privacy & Contact */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-50/50 dark:bg-slate-900/50">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Privacy */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    {t('about.privacy')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {['minimal', 'anonymized', 'noSell', 'encrypted', 'deletion'].map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-muted">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        {t(`about.privacyItems.${item}`)}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="w-5 h-5" />
                    {t('about.contact')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isSubmitted ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-8"
                    >
                      <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-8 h-8 text-green-500" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">{t('about.contactForm.sent')}</h3>
                      <p className="text-muted text-sm">{t('about.contactForm.sentDesc')}</p>
                      <Button
                        variant="secondary"
                        className="mt-4"
                        onClick={() => setIsSubmitted(false)}
                      >
                        {t('about.contactForm.sendAnother')}
                      </Button>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <Input
                        label={t('about.contactForm.name')}
                        value={contactForm.name}
                        onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))}
                        required
                      />
                      <Input
                        label={t('about.contactForm.email')}
                        type="email"
                        value={contactForm.email}
                        onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                        required
                      />
                      <div>
                        <label className="block text-sm font-medium mb-1.5">{t('about.contactForm.message')}</label>
                        <textarea
                          value={contactForm.message}
                          onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                          rows={3}
                          required
                          className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500"
                        />
                      </div>
                      <Button type="submit" className="w-full">
                        <Send className="w-4 h-4 mr-2" />
                        {t('common.send')}
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}
