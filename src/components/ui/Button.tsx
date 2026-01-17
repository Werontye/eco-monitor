import { ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, children, disabled, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-95 disabled:opacity-50 disabled:pointer-events-none'

    const variants = {
      primary: 'bg-primary-500 hover:bg-primary-600 text-white focus:ring-primary-500/50 shadow-lg shadow-primary-500/20',
      secondary: 'bg-surface border border-border hover:bg-slate-100 dark:hover:bg-slate-800 text-foreground focus:ring-primary-500/50',
      ghost: 'hover:bg-slate-100 dark:hover:bg-slate-800 text-foreground focus:ring-primary-500/50',
      danger: 'bg-red-500 hover:bg-red-600 text-white focus:ring-red-500/50 shadow-lg shadow-red-500/20',
    }

    const sizes = {
      sm: 'text-sm py-1.5 px-3 gap-1.5',
      md: 'text-sm py-2.5 px-5 gap-2',
      lg: 'text-base py-3 px-6 gap-2.5',
    }

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        )}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'

export default Button
