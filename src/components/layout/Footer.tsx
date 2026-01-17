import { useTranslation } from 'react-i18next'
import { Heart, Leaf } from 'lucide-react'

export default function Footer() {
  const { t } = useTranslation()
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-surface border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-foreground">EcoMonitor</span>
          </div>

          <div className="flex items-center gap-1 text-sm text-muted">
            <span>{t('footer.madeWith')}</span>
            <Heart className="w-4 h-4 text-red-500 fill-red-500" />
          </div>

          <p className="text-sm text-muted">
            {currentYear} EcoMonitor. {t('footer.rights')}
          </p>
        </div>
      </div>
    </footer>
  )
}
