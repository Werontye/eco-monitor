import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingCart, Plus, Minus, Trash2, CheckCircle, Leaf, Droplets, Package, Shell, CreditCard, Banknote, AlertCircle, X, Clock, Truck, Star, Info, Sparkles } from 'lucide-react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Modal from '@/components/ui/Modal'
import { products } from '@/data/products'
import { cities } from '@/data/cities'
import { Product, CartItem } from '@/types'
import { cn } from '@/lib/utils'

const categories = [
  { id: 'all', labelKey: 'helpNow.categories.all', icon: Package },
  { id: 'air', labelKey: 'helpNow.categories.airPlants', icon: Leaf },
  { id: 'water', labelKey: 'helpNow.categories.waterPlants', icon: Droplets },
  { id: 'kit', labelKey: 'helpNow.categories.kits', icon: Package },
]

const difficultyColors = {
  easy: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  advanced: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
}

export default function HelpNow() {
  const { t } = useTranslation()
  const [activeCategory, setActiveCategory] = useState('all')
  const [cart, setCart] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  const [checkoutStep, setCheckoutStep] = useState(1)
  const [orderComplete, setOrderComplete] = useState(false)
  const [checkoutForm, setCheckoutForm] = useState({
    city: '',
    name: '',
    phone: '',
    address: '',
    paymentMethod: 'cash',
    cardNumber: '',
    cardExpiry: '',
    cardCvc: '',
  })
  const [validationError, setValidationError] = useState<string | null>(null)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  const filteredProducts = activeCategory === 'all'
    ? products
    : products.filter(p => p.category === activeCategory)

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id)
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...prev, { product, quantity: 1 }]
    })
  }

  const updateQuantity = (productId: string, delta: number) => {
    setCart(prev =>
      prev
        .map(item => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta
            return newQty > 0 ? { ...item, quantity: newQty } : null
          }
          return item
        })
        .filter(Boolean) as CartItem[]
    )
  }

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId))
  }

  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('uz-UZ').format(price) + ' UZS'
  }

  const validateStep = (): boolean => {
    setValidationError(null)

    if (checkoutStep === 1) {
      if (!checkoutForm.city) {
        setValidationError(t('helpNow.checkout.errors.cityRequired'))
        return false
      }
    }

    if (checkoutStep === 2) {
      if (!checkoutForm.name.trim()) {
        setValidationError(t('helpNow.checkout.errors.nameRequired'))
        return false
      }
      if (!checkoutForm.phone.trim()) {
        setValidationError(t('helpNow.checkout.errors.phoneRequired'))
        return false
      }
      if (!checkoutForm.address.trim()) {
        setValidationError(t('helpNow.checkout.errors.addressRequired'))
        return false
      }
    }

    if (checkoutStep === 3 && checkoutForm.paymentMethod === 'card') {
      const cardNum = checkoutForm.cardNumber.replace(/\s/g, '')
      if (cardNum.length < 16) {
        setValidationError(t('helpNow.checkout.errors.cardNumberInvalid'))
        return false
      }
      if (checkoutForm.cardExpiry.length < 5) {
        setValidationError(t('helpNow.checkout.errors.cardExpiryInvalid'))
        return false
      }
      if (checkoutForm.cardCvc.length < 3) {
        setValidationError(t('helpNow.checkout.errors.cardCvcInvalid'))
        return false
      }
    }

    return true
  }

  const handleCheckout = () => {
    if (!validateStep()) {
      return
    }

    if (checkoutStep < 3) {
      setCheckoutStep(prev => prev + 1)
    } else {
      setOrderComplete(true)
      setCart([])
      setCheckoutForm({
        city: '',
        name: '',
        phone: '',
        address: '',
        paymentMethod: 'cash',
        cardNumber: '',
        cardExpiry: '',
        cardCvc: '',
      })
    }
  }

  const cityOptions = cities.map(city => ({
    value: city.id,
    label: t(city.nameKey),
  }))

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'air': return Leaf
      case 'water': return Droplets
      case 'kit': return Package
      default: return Leaf
    }
  }

  // Get delivery time based on category
  const getDeliveryTime = (category: string) => {
    switch (category) {
      case 'air': return '2-3'
      case 'water': return '1-2'
      case 'kit': return '3-5'
      default: return '2-4'
    }
  }

  // Get benefits for each product category
  const getBenefits = (product: Product) => {
    const benefitsMap: Record<string, string[]> = {
      air: ['helpNow.detail.benefits.purifyAir', 'helpNow.detail.benefits.naturalDecor', 'helpNow.detail.benefits.lowMaintenance'],
      water: ['helpNow.detail.benefits.filterWater', 'helpNow.detail.benefits.indicatorHealth', 'helpNow.detail.benefits.ecoFriendly'],
      kit: ['helpNow.detail.benefits.comprehensiveMonitoring', 'helpNow.detail.benefits.digitalReadings', 'helpNow.detail.benefits.professionalGrade'],
    }
    return benefitsMap[product.category] || benefitsMap.air
  }

  // Product Detail Modal
  const ProductDetailModal = ({ product, onClose }: { product: Product; onClose: () => void }) => {
    const Icon = getCategoryIcon(product.category)
    const isSnail = product.id === 'ramshorn-snails'
    const ProductIcon = isSnail ? Shell : Icon
    const deliveryDays = getDeliveryTime(product.category)
    const benefits = getBenefits(product)

    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-surface rounded-3xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/20 hover:bg-black/30 text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Product Image */}
            <div className="relative h-64 sm:h-72 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 overflow-hidden">
              {product.image ? (
                <motion.img
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5 }}
                  src={product.image}
                  alt={t(product.nameKey)}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', delay: 0.2 }}
                  >
                    <ProductIcon className={cn(
                      'w-32 h-32',
                      product.category === 'air' && 'text-green-400',
                      product.category === 'water' && 'text-cyan-400',
                      product.category === 'kit' && 'text-purple-400'
                    )} />
                  </motion.div>
                </div>
              )}

              {/* Category Badge */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="absolute top-4 left-4"
              >
                <span className={cn(
                  'px-3 py-1.5 rounded-full text-sm font-medium backdrop-blur-sm',
                  product.category === 'air' && 'bg-green-500/90 text-white',
                  product.category === 'water' && 'bg-cyan-500/90 text-white',
                  product.category === 'kit' && 'bg-purple-500/90 text-white'
                )}>
                  {t(`helpNow.categories.${product.category === 'air' ? 'airPlants' : product.category === 'water' ? 'waterPlants' : 'kits'}`)}
                </span>
              </motion.div>

              {/* Stock Status */}
              {!product.inStock && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="text-white font-medium text-lg">{t('common.outOfStock')}</span>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-6 sm:p-8">
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="flex items-start justify-between mb-4">
                  <h2 className="text-2xl sm:text-3xl font-bold pr-4">{t(product.nameKey)}</h2>
                  <span className={cn('text-xs px-3 py-1.5 rounded-full whitespace-nowrap', difficultyColors[product.difficulty])}>
                    {t(`helpNow.product.${product.difficulty}`)}
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                    {formatPrice(product.price)}
                  </span>
                  {product.inStock && (
                    <span className="flex items-center gap-1 text-sm text-green-600 dark:text-green-400">
                      <CheckCircle className="w-4 h-4" />
                      {t('helpNow.detail.inStock')}
                    </span>
                  )}
                </div>
              </motion.div>

              {/* Description */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-6"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Info className="w-5 h-5 text-primary-500" />
                  <h3 className="font-semibold">{t('helpNow.detail.description')}</h3>
                </div>
                <p className="text-muted leading-relaxed">{t(product.descriptionKey)}</p>
              </motion.div>

              {/* How it helps */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mb-6"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-5 h-5 text-yellow-500" />
                  <h3 className="font-semibold">{t('helpNow.detail.howItHelps')}</h3>
                </div>
                <div className="space-y-2">
                  {benefits.map((benefit, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50"
                    >
                      <div className="w-8 h-8 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                        <Star className="w-4 h-4 text-primary-500" />
                      </div>
                      <span className="text-sm">{t(benefit)}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* What it monitors */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mb-6"
              >
                <div className="flex items-center gap-2 mb-3">
                  <ProductIcon className="w-5 h-5 text-cyan-500" />
                  <h3 className="font-semibold">{t('helpNow.detail.monitors')}</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.monitorsKeys.map((key, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.6 + i * 0.05 }}
                    >
                      <Badge variant="primary" size="md">{t(key)}</Badge>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Delivery Info */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="mb-8"
              >
                <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-primary-50 to-cyan-50 dark:from-primary-900/20 dark:to-cyan-900/20 border border-primary-200 dark:border-primary-800">
                  <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                    <Truck className="w-6 h-6 text-primary-500" />
                  </div>
                  <div>
                    <p className="font-medium">{t('helpNow.detail.delivery')}</p>
                    <div className="flex items-center gap-2 text-sm text-muted">
                      <Clock className="w-4 h-4" />
                      <span>{deliveryDays} {t('helpNow.detail.days')}</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Actions */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="flex gap-3"
              >
                <Button
                  variant="secondary"
                  className="flex-1"
                  onClick={onClose}
                >
                  {t('common.close')}
                </Button>
                <Button
                  className="flex-1"
                  onClick={() => {
                    addToCart(product)
                    onClose()
                  }}
                  disabled={!product.inStock}
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  {t('common.addToCart')}
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    )
  }

  const ProductCard = ({ product }: { product: Product }) => {
    const Icon = getCategoryIcon(product.category)
    const isSnail = product.id === 'ramshorn-snails'
    const ProductIcon = isSnail ? Shell : Icon

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ y: -4 }}
        className="group cursor-pointer"
        onClick={() => setSelectedProduct(product)}
      >
        <Card hover className="h-full flex flex-col">
          {/* Product Image */}
          <div className="relative h-48 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 rounded-xl mb-4 overflow-hidden">
            {product.image ? (
              <img
                src={product.image}
                alt={t(product.nameKey)}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <ProductIcon className={cn(
                  'w-20 h-20 transition-transform duration-300 group-hover:scale-110',
                  product.category === 'air' && 'text-green-400',
                  product.category === 'water' && 'text-cyan-400',
                  product.category === 'kit' && 'text-purple-400'
                )} />
              </div>
            )}
            {!product.inStock && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="text-white font-medium">{t('common.outOfStock')}</span>
              </div>
            )}
            {/* View Details Overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
              <span className="px-4 py-2 bg-white/90 dark:bg-slate-900/90 rounded-full text-sm font-medium">
                {t('helpNow.detail.viewDetails')}
              </span>
            </div>
          </div>

          {/* Product Name */}
          <h3 className="font-semibold mb-2 line-clamp-2">{t(product.nameKey)}</h3>

          {/* Description */}
          <p className="text-sm text-muted mb-4 flex-1 line-clamp-3">{t(product.descriptionKey)}</p>

          {/* Monitors */}
          <div className="mb-4">
            <p className="text-xs text-muted mb-1.5">{t('helpNow.product.monitors')}:</p>
            <div className="flex flex-wrap gap-1">
              {product.monitorsKeys.slice(0, 3).map((key, i) => (
                <Badge key={i} size="sm">{t(key)}</Badge>
              ))}
              {product.monitorsKeys.length > 3 && (
                <Badge size="sm">+{product.monitorsKeys.length - 3}</Badge>
              )}
            </div>
          </div>

          {/* Difficulty & Price */}
          <div className="flex items-center justify-between mb-4">
            <span className={cn('text-xs px-2 py-1 rounded-full', difficultyColors[product.difficulty])}>
              {t(`helpNow.product.${product.difficulty}`)}
            </span>
            <span className="text-lg font-bold text-primary-600 dark:text-primary-400">
              {formatPrice(product.price)}
            </span>
          </div>

          {/* Add to Cart Button */}
          <Button
            className="w-full"
            onClick={(e) => {
              e.stopPropagation()
              addToCart(product)
            }}
            disabled={!product.inStock}
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            {t('common.addToCart')}
          </Button>
        </Card>
      </motion.div>
    )
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold mb-2">{t('helpNow.title')}</h1>
          <p className="text-muted">{t('helpNow.subtitle')}</p>
        </motion.div>

        {/* Category Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap justify-center gap-2 mb-8"
        >
          {categories.map((cat) => {
            const Icon = cat.icon
            const isActive = activeCategory === cat.id
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all',
                  isActive
                    ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/25'
                    : 'bg-surface border border-border hover:border-primary-300 dark:hover:border-primary-700'
                )}
              >
                <Icon className="w-5 h-5" />
                {t(cat.labelKey)}
              </button>
            )
          })}
        </motion.div>

        {/* Products Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {filteredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * index }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>

        {/* Floating Cart Button */}
        <AnimatePresence>
          {cartCount > 0 && (
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              onClick={() => setIsCartOpen(true)}
              className="fixed bottom-6 right-6 bg-primary-500 text-white p-4 rounded-full shadow-xl shadow-primary-500/30 hover:bg-primary-600 transition-colors z-50"
            >
              <ShoppingCart className="w-6 h-6" />
              <span className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full text-xs flex items-center justify-center font-bold">
                {cartCount}
              </span>
            </motion.button>
          )}
        </AnimatePresence>

        {/* Cart Modal */}
        <Modal
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          title={t('helpNow.cart.title')}
          size="lg"
        >
          {cart.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingCart className="w-16 h-16 mx-auto text-muted mb-4" />
              <p className="text-muted">{t('helpNow.cart.empty')}</p>
            </div>
          ) : (
            <>
              <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto">
                {cart.map((item) => (
                  <div key={item.product.id} className="flex items-center gap-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
                      {item.product.image ? (
                        <img src={item.product.image} alt={t(item.product.nameKey)} className="w-full h-full object-cover" />
                      ) : (
                        <Leaf className="w-8 h-8 text-primary-500" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{t(item.product.nameKey)}</p>
                      <p className="text-sm text-muted">{formatPrice(item.product.price)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.product.id, -1)}
                        className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, 1)}
                        className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="border-t border-border pt-4">
                <div className="flex justify-between text-lg font-semibold mb-4">
                  <span>{t('helpNow.cart.total')}</span>
                  <span className="text-primary-600 dark:text-primary-400">{formatPrice(cartTotal)}</span>
                </div>
                <Button
                  className="w-full"
                  onClick={() => {
                    setIsCartOpen(false)
                    setIsCheckoutOpen(true)
                    setCheckoutStep(1)
                    setOrderComplete(false)
                  }}
                >
                  {t('common.checkout')}
                </Button>
              </div>
            </>
          )}
        </Modal>

        {/* Product Detail Modal */}
        {selectedProduct && (
          <ProductDetailModal
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
          />
        )}

        {/* Checkout Modal */}
        <Modal
          isOpen={isCheckoutOpen}
          onClose={() => setIsCheckoutOpen(false)}
          title={orderComplete ? t('helpNow.checkout.success') : t('helpNow.checkout.title')}
          size="lg"
        >
          {orderComplete ? (
            <div className="text-center py-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <CheckCircle className="w-10 h-10 text-green-500" />
              </motion.div>
              <h3 className="text-xl font-semibold mb-2">{t('helpNow.checkout.success')}</h3>
              <p className="text-muted mb-4">
                {t('helpNow.checkout.orderNumber')}: #{Math.floor(Math.random() * 900000) + 100000}
              </p>
              <Button onClick={() => setIsCheckoutOpen(false)}>{t('common.close')}</Button>
            </div>
          ) : (
            <>
              {/* Progress Steps */}
              <div className="flex items-center justify-center gap-2 mb-6">
                {[1, 2, 3].map((step) => (
                  <div key={step} className="flex items-center">
                    <div
                      className={cn(
                        'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium',
                        checkoutStep >= step
                          ? 'bg-primary-500 text-white'
                          : 'bg-slate-200 dark:bg-slate-700 text-muted'
                      )}
                    >
                      {step}
                    </div>
                    {step < 3 && (
                      <div
                        className={cn(
                          'w-12 h-1 mx-1 rounded',
                          checkoutStep > step ? 'bg-primary-500' : 'bg-slate-200 dark:bg-slate-700'
                        )}
                      />
                    )}
                  </div>
                ))}
              </div>

              {/* Validation Error */}
              {validationError && (
                <div className="flex items-center gap-2 p-3 mb-4 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm">{validationError}</span>
                </div>
              )}

              {/* Step Content */}
              <div className="min-h-[200px]">
                {checkoutStep === 1 && (
                  <div className="space-y-4">
                    <Select
                      label={t('helpNow.checkout.city')}
                      options={cityOptions}
                      value={checkoutForm.city}
                      onChange={(e) => {
                        setValidationError(null)
                        setCheckoutForm(prev => ({ ...prev, city: e.target.value }))
                      }}
                      placeholder={t('helpNow.checkout.city')}
                    />
                  </div>
                )}

                {checkoutStep === 2 && (
                  <div className="space-y-4">
                    <Input
                      label={t('helpNow.checkout.name')}
                      value={checkoutForm.name}
                      onChange={(e) => {
                        setValidationError(null)
                        setCheckoutForm(prev => ({ ...prev, name: e.target.value }))
                      }}
                    />
                    <Input
                      label={t('helpNow.checkout.phone')}
                      value={checkoutForm.phone}
                      onChange={(e) => {
                        setValidationError(null)
                        setCheckoutForm(prev => ({ ...prev, phone: e.target.value }))
                      }}
                    />
                    <Input
                      label={t('helpNow.checkout.address')}
                      value={checkoutForm.address}
                      onChange={(e) => {
                        setValidationError(null)
                        setCheckoutForm(prev => ({ ...prev, address: e.target.value }))
                      }}
                    />
                  </div>
                )}

                {checkoutStep === 3 && (
                  <div className="space-y-4">
                    <p className="font-medium mb-2">{t('helpNow.checkout.payment')}</p>
                    <div className="space-y-2">
                      <label
                        className={cn(
                          'flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all',
                          checkoutForm.paymentMethod === 'cash'
                            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                            : 'border-border hover:border-primary-300'
                        )}
                      >
                        <input
                          type="radio"
                          name="payment"
                          value="cash"
                          checked={checkoutForm.paymentMethod === 'cash'}
                          onChange={(e) => setCheckoutForm(prev => ({ ...prev, paymentMethod: e.target.value }))}
                          className="w-4 h-4 text-primary-500"
                        />
                        <Banknote className="w-5 h-5 text-green-600" />
                        <span>{t('helpNow.checkout.cash')}</span>
                      </label>

                      <label
                        className={cn(
                          'flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all',
                          checkoutForm.paymentMethod === 'card'
                            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                            : 'border-border hover:border-primary-300'
                        )}
                      >
                        <input
                          type="radio"
                          name="payment"
                          value="card"
                          checked={checkoutForm.paymentMethod === 'card'}
                          onChange={(e) => setCheckoutForm(prev => ({ ...prev, paymentMethod: e.target.value }))}
                          className="w-4 h-4 text-primary-500"
                        />
                        <CreditCard className="w-5 h-5 text-blue-600" />
                        <span>{t('helpNow.checkout.card')}</span>
                      </label>
                    </div>

                    {/* Card Details Form */}
                    {checkoutForm.paymentMethod === 'card' && (
                      <div className="mt-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 space-y-4">
                        <div className="flex items-center gap-2 mb-2">
                          <CreditCard className="w-5 h-5 text-primary-500" />
                          <span className="font-medium">{t('helpNow.checkout.cardDetails')}</span>
                        </div>
                        <Input
                          label={t('helpNow.checkout.cardNumber')}
                          value={checkoutForm.cardNumber}
                          onChange={(e) => {
                            setValidationError(null)
                            const value = e.target.value.replace(/\D/g, '').slice(0, 16)
                            const formatted = value.replace(/(\d{4})(?=\d)/g, '$1 ')
                            setCheckoutForm(prev => ({ ...prev, cardNumber: formatted }))
                          }}
                          placeholder="1234 5678 9012 3456"
                        />
                        <div className="grid grid-cols-2 gap-4">
                          <Input
                            label={t('helpNow.checkout.cardExpiry')}
                            value={checkoutForm.cardExpiry}
                            onChange={(e) => {
                              setValidationError(null)
                              let value = e.target.value.replace(/\D/g, '').slice(0, 4)
                              if (value.length >= 2) {
                                value = value.slice(0, 2) + '/' + value.slice(2)
                              }
                              setCheckoutForm(prev => ({ ...prev, cardExpiry: value }))
                            }}
                            placeholder="MM/YY"
                          />
                          <Input
                            label="CVC"
                            value={checkoutForm.cardCvc}
                            onChange={(e) => {
                              setValidationError(null)
                              const value = e.target.value.replace(/\D/g, '').slice(0, 3)
                              setCheckoutForm(prev => ({ ...prev, cardCvc: value }))
                            }}
                            placeholder="123"
                            type="password"
                          />
                        </div>
                      </div>
                    )}

                    <div className="mt-6 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                      <p className="font-medium mb-2">{t('helpNow.cart.total')}</p>
                      <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                        {formatPrice(cartTotal)}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-3 mt-6">
                {checkoutStep > 1 && (
                  <Button variant="secondary" onClick={() => {
                    setValidationError(null)
                    setCheckoutStep(prev => prev - 1)
                  }}>
                    {t('common.back')}
                  </Button>
                )}
                <Button className="flex-1" onClick={handleCheckout}>
                  {checkoutStep === 3 ? t('helpNow.checkout.confirm') : t('common.next')}
                </Button>
              </div>
            </>
          )}
        </Modal>
      </div>
    </div>
  )
}
