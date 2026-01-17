import { Routes, Route } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import Layout from '@/components/layout/Layout'

// Lazy load pages for better performance
const Home = lazy(() => import('@/pages/Home'))
const Monitoring = lazy(() => import('@/pages/Monitoring'))
const Analysis = lazy(() => import('@/pages/Analysis'))
const AIAdvisory = lazy(() => import('@/pages/AIAdvisory'))
const HelpNow = lazy(() => import('@/pages/HelpNow'))
const About = lazy(() => import('@/pages/About'))

// Loading component
function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin" />
        <p className="text-muted">Loading...</p>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <Layout>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/monitoring" element={<Monitoring />} />
          <Route path="/analysis" element={<Analysis />} />
          <Route path="/ai" element={<AIAdvisory />} />
          <Route path="/help" element={<HelpNow />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </Suspense>
    </Layout>
  )
}
