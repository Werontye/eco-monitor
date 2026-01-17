import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatNumber(value: number, decimals: number = 1): string {
  return value.toFixed(decimals)
}

export function formatDate(date: Date, locale: string = 'en'): string {
  return new Intl.DateTimeFormat(locale, {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: 'short',
  }).format(date)
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'good':
      return 'status-good'
    case 'moderate':
      return 'status-moderate'
    case 'poor':
      return 'status-poor'
    case 'alert':
      return 'status-alert'
    default:
      return ''
  }
}

export function getStatusFromValue(value: number, thresholds: { good: number; moderate: number; poor: number }): string {
  if (value <= thresholds.good) return 'good'
  if (value <= thresholds.moderate) return 'moderate'
  if (value <= thresholds.poor) return 'poor'
  return 'alert'
}

export function generateSparklineData(baseValue: number, points: number = 24): number[] {
  const data: number[] = []
  let current = baseValue
  for (let i = 0; i < points; i++) {
    current = current + (Math.random() - 0.5) * (baseValue * 0.1)
    current = Math.max(0, current)
    data.push(Math.round(current * 10) / 10)
  }
  return data
}

export function calculateDelta(current: number, previous: number): { value: number; trend: 'up' | 'down' | 'stable' } {
  const delta = current - previous
  const trend = delta > 0.5 ? 'up' : delta < -0.5 ? 'down' : 'stable'
  return { value: Math.abs(delta), trend }
}
