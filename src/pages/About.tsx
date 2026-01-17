import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Target, Database, Shield, Mail, Users, ExternalLink, Send, CheckCircle } from 'lucide-react'
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { cn } from '@/lib/utils'

const features = [
  {
    icon: Target,
    titleKey: 'about.mission',
    descKey: 'about.missionText',
    color: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
  },
  {
    icon: Database,
    titleKey: 'about.dataSources',
    desc: 'We collect data from government meteorological stations, partner sensors, and satellite imagery to provide comprehensive environmental insights.',
    color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
  },
  {
    icon: Shield,
    titleKey: 'about.methodology',
    desc: 'Our data processing follows international standards (WHO, EPA) with regular calibration and validation against reference measurements.',
    color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
  },
]

const partners = [
  { name: 'Ministry of Ecology', type: 'Government' },
  { name: 'Uzhydromet', type: 'Data Provider' },
  { name: 'Tashkent State University', type: 'Research' },
  { name: 'UNDP Uzbekistan', type: 'International' },
]

export default function About() {
  const { t } = useTranslation()
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' })
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitted(true)
      setContactForm({ name: '', email: '', message: '' })
    }, 500)
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl font-bold mb-4">{t('about.title')}</h1>
          <p className="text-xl text-muted max-w-2xl mx-auto">
            Empowering communities with real-time environmental data for a healthier, sustainable Uzbekistan.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
        >
          {features.map((feature, index) => (
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
                  <p className="text-sm text-muted">
                    {feature.descKey ? t(feature.descKey) : feature.desc}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Data Collection Process */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-16"
        >
          <Card>
            <CardHeader>
              <CardTitle>How We Collect Data</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                  { step: 1, title: 'Sensor Network', desc: 'IoT sensors across major cities' },
                  { step: 2, title: 'Data Processing', desc: 'Real-time validation & cleaning' },
                  { step: 3, title: 'AI Analysis', desc: 'Pattern detection & predictions' },
                  { step: 4, title: 'User Delivery', desc: 'Live dashboard & alerts' },
                ].map((item, index) => (
                  <div key={item.step} className="text-center">
                    <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mx-auto mb-3">
                      <span className="text-lg font-bold text-primary-600 dark:text-primary-400">{item.step}</span>
                    </div>
                    <h4 className="font-medium mb-1">{item.title}</h4>
                    <p className="text-sm text-muted">{item.desc}</p>
                    {index < 3 && (
                      <div className="hidden md:block absolute top-6 -right-3 w-6 text-muted">
                        <ExternalLink className="w-4 h-4 rotate-90" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Partners */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-16"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                {t('about.partners')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {partners.map((partner) => (
                  <div
                    key={partner.name}
                    className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-center"
                  >
                    <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mx-auto mb-3">
                      <Users className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                    </div>
                    <p className="font-medium text-sm">{partner.name}</p>
                    <p className="text-xs text-muted">{partner.type}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Privacy Policy Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-16"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                {t('about.privacy')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <ul className="space-y-2 text-sm text-muted">
                  <li>We collect minimal personal data necessary for service operation</li>
                  <li>Environmental sensor data is anonymized and aggregated</li>
                  <li>We do not sell or share personal information with third parties</li>
                  <li>All data transmission is encrypted using industry-standard protocols</li>
                  <li>Users can request data deletion at any time</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card>
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
                  <h3 className="text-lg font-semibold mb-2">Message Sent!</h3>
                  <p className="text-muted">We'll get back to you as soon as possible.</p>
                  <Button
                    variant="secondary"
                    className="mt-4"
                    onClick={() => setIsSubmitted(false)}
                  >
                    Send Another Message
                  </Button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
                  <Input
                    label="Name"
                    value={contactForm.name}
                    onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                  <Input
                    label="Email"
                    type="email"
                    value={contactForm.email}
                    onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                    required
                  />
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Message</label>
                    <textarea
                      value={contactForm.message}
                      onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                      rows={4}
                      required
                      className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500"
                    />
                  </div>
                  <Button type="submit">
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
  )
}
