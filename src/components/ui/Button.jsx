import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const baseStyles =
  'inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60'

const variants = {
  primary:
    'bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-black dark:hover:bg-white/90 shadow-sm',
  secondary:
    'border border-black/15 text-black/80 hover:border-black/30 hover:text-black dark:border-white/15 dark:text-white/80 dark:hover:border-white/30 dark:hover:text-white',
}

/**
 * A single Button component used everywhere (Hero, Contact, etc).
 * Renders as an internal <Link>, external <a>, or <button> depending on props.
 */
export default function Button({
  children,
  to,
  href,
  onClick,
  type = 'button',
  variant = 'primary',
  icon: Icon,
  disabled = false,
  className = '',
}) {
  const classes = `${baseStyles} ${variants[variant]} ${disabled ? 'pointer-events-none opacity-60' : ''} ${className}`

  const content = (
    <motion.span
      whileHover={disabled ? undefined : { y: -2 }}
      whileTap={disabled ? undefined : { scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      className={classes}
    >
      {children}
      {Icon && <Icon size={16} />}
    </motion.span>
  )

  if (to) {
    return (
      <Link to={to} className="inline-block">
        {content}
      </Link>
    )
  }

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block"
      >
        {content}
      </a>
    )
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className="inline-block">
      {content}
    </button>
  )
}
