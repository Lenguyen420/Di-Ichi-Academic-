export const Button = ({ children, className = '', variant = 'primary', ...props }) => {
  const variants = {
    primary: 'bg-orange-600 text-white hover:bg-orange-700',
    secondary: 'border border-orange-200 bg-white text-orange-700 hover:bg-orange-50',
    ghost: 'text-slate-600 hover:bg-orange-50 hover:text-orange-700',
  }

  return (
    <button
      className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
