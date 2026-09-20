import { motion } from 'framer-motion'

/**
 * Consistent large heading + optional eyebrow/subtitle used at the top of every section.
 * Animates in once when it scrolls into view.
 */
export default function SectionHeading({ eyebrow, title, subtitle, align = 'left' }) {
  const alignment = align === 'center' ? 'items-center text-center mx-auto' : 'items-start text-left'

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`flex flex-col gap-3 ${alignment} max-w-2xl`}
    >
      {eyebrow && (
        <span className="text-xs font-medium uppercase tracking-[0.2em] text-accent">
          {eyebrow}
        </span>
      )}
      <h2 className="text-4xl sm:text-5xl font-semibold text-black dark:text-white">
        {title}
      </h2>
      {subtitle && (
        <p className="text-base text-black/60 dark:text-white/60">{subtitle}</p>
      )}
    </motion.div>
  )
}
