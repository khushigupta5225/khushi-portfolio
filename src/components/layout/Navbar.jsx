import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import ThemeToggle from '@/components/ui/ThemeToggle'
import SocialIcon from '@/components/ui/SocialIcon'
import { socials } from '@/data/profile'

const NAV_ITEMS = [
  { label: 'Home', targetId: 'hero' },
  { label: 'About', targetId: 'about' },
  { label: 'Skills', targetId: 'tech-stack' },
  { label: 'Projects', targetId: 'projects' },
  { label: 'Contact', targetId: 'contact' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const isHomePage = location.pathname === '/'
  const [activeSection, setActiveSection] = useState(() =>
    location.pathname === '/projects' ? 'projects' : 'hero'
  )

  // Track scroll position for header glassmorphism
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Scrollspy via IntersectionObserver for active navigation indicator
  useEffect(() => {
    if (!isHomePage) return

    const sectionIds = ['hero', 'about', 'tech-stack', 'projects', 'contact']
    const observers = []

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id)
        }
      })
    }

    const observerOptions = {
      root: null,
      rootMargin: '-30% 0px -40% 0px',
      threshold: 0,
    }

    sectionIds.forEach((id) => {
      const el = document.getElementById(id)
      if (el) {
        const obs = new IntersectionObserver(observerCallback, observerOptions)
        obs.observe(el)
        observers.push(obs)
      }
    })

    return () => {
      observers.forEach((obs) => obs.disconnect())
    }
  }, [isHomePage, location.pathname])

  const handleNavClick = (targetId) => {
    setOpen(false)
    if (isHomePage) {
      const el = document.getElementById(targetId)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' })
      }
    } else {
      navigate(`/#${targetId}`)
    }
  }

  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'border-b border-black/10 bg-white/80 dark:border-white/10 dark:bg-[#08080c]/85 backdrop-blur-md shadow-sm'
          : 'border-b border-transparent bg-transparent'
      }`}
    >
      <div className="mx-auto flex h-16 w-full items-center justify-between px-5 sm:px-10 lg:px-16">
        {/* Brand / Logo */}
        <Link
          to="/"
          className="group flex items-center py-1 transition-transform duration-200 hover:scale-105 focus-ring rounded-lg"
          onClick={() => {
            setOpen(false)
            if (isHomePage) {
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }
          }}
        >
          <img
            src="/kg-logo.png"
            alt="KG Logo"
            className="h-8 sm:h-[37px] w-auto object-contain transition-all duration-200 dark:brightness-0 dark:invert"
          />
        </Link>

        {/* Desktop Navigation Links with Animated Cat Paw Pill */}
        <nav className="hidden md:flex items-center gap-1 rounded-full border border-black/10 dark:border-white/15 bg-black/5 dark:bg-white/5 px-2 py-1 backdrop-blur-md">
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.targetId
            return (
              <button
                key={item.label}
                type="button"
                onClick={() => handleNavClick(item.targetId)}
                className={`relative px-4 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-full transition-colors duration-200 focus-ring ${
                  isActive
                    ? 'text-white dark:text-slate-950'
                    : 'text-black/70 hover:text-black dark:text-white/70 dark:hover:text-white'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="active-pill"
                    transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                    className="absolute inset-0 bg-slate-900 dark:bg-white rounded-full shadow-md z-0"
                  />
                )}
                <span className="relative z-10 flex items-center gap-1.5">
                  {item.label}
                  {isActive && <span className="text-[10px]">🐾</span>}
                </span>
              </button>
            )
          })}
        </nav>

        {/* Desktop Socials & Theme Toggle */}
        <div className="hidden sm:flex items-center gap-5">
          <div className="flex items-center gap-4 border-r border-black/10 dark:border-white/10 pr-4">
            {socials.map((social) => (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.name}
                className="text-black/60 transition-all duration-200 hover:-translate-y-0.5 hover:text-violet-500 dark:text-white/60 dark:hover:text-violet-400 focus-ring rounded"
              >
                <SocialIcon icon={social.icon} size={21} />
              </a>
            ))}
          </div>
          <ThemeToggle />
        </div>

        {/* Mobile controls (Theme Toggle + Hamburger) */}
        <div className="flex items-center gap-3 sm:hidden">
          <ThemeToggle />
          <button
            type="button"
            aria-label="Toggle navigation menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 text-black/80 transition-colors hover:border-black/20 dark:border-white/15 dark:text-white/80 dark:hover:border-white/30 focus-ring"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={open ? 'close' : 'menu'}
                initial={{ opacity: 0, rotate: -45 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 45 }}
                transition={{ duration: 0.15 }}
                className="flex items-center justify-center"
              >
                {open ? <X size={18} /> : <Menu size={18} />}
              </motion.span>
            </AnimatePresence>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden border-t border-black/10 bg-white/95 backdrop-blur-xl dark:border-white/10 dark:bg-[#08080c]/95 md:hidden"
          >
            <div className="flex flex-col gap-1 px-6 py-6">
              {/* Section links */}
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => handleNavClick(item.targetId)}
                  className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition-colors text-left ${
                    activeSection === item.targetId
                      ? 'bg-violet-500/10 text-violet-600 dark:bg-violet-500/20 dark:text-violet-300'
                      : 'text-black/75 hover:bg-black/5 dark:text-white/75 dark:hover:bg-white/5'
                  }`}
                >
                  <span>{item.label}</span>
                  {activeSection === item.targetId && <span>🐾</span>}
                </button>
              ))}

              {/* Mobile Socials */}
              <div className="flex items-center gap-5 pt-4 mt-3 border-t border-black/10 dark:border-white/10 px-4">
                {socials.map((social) => (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.name}
                    className="text-black/60 dark:text-white/60 hover:text-violet-500"
                  >
                    <SocialIcon icon={social.icon} size={21} />
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
