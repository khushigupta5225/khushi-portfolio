import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import ThemeToggle from '@/components/ui/ThemeToggle'
import SocialIcon from '@/components/ui/SocialIcon'
import { socials } from '@/data/profile'
import { useActiveSection } from '@/context/ActiveSectionContext'

const NAV_ITEMS = [
  { label: 'Home', targetId: 'hero' },
  { label: 'About', targetId: 'about' },
  { label: 'Skills', targetId: 'tech-stack' },
  { label: 'Projects', targetId: 'projects' },
  { label: 'Contact', targetId: 'contact' },
]

export default function Navbar() {
  const { activeSection, navigateTo } = useActiveSection()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const isHomePage = location.pathname === '/'

  // Track scroll position for header glassmorphism
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 15)
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const currentActive = isHomePage
    ? activeSection
    : location.pathname === '/projects'
    ? 'projects'
    : ''

  const handleNavClick = (targetId) => {
    setOpen(false)
    navigateTo(targetId)
  }

  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'border-b border-black/10 bg-white/90 dark:border-white/10 dark:bg-[#08080c]/90 backdrop-blur-md shadow-sm'
          : 'border-b border-transparent bg-white/40 dark:bg-[#08080c]/40 backdrop-blur-xs'
      }`}
    >
      <div className="mx-auto flex h-16 sm:h-20 w-full items-center justify-between px-4 sm:px-8 lg:px-16 max-w-7xl">
        {/* Brand / Logo: CodeCraft style with </> motif */}
        <Link
          to="/"
          className="group flex items-center gap-2.5 sm:gap-3 focus-ring rounded-lg py-1 shrink-0"
          onClick={() => {
            setOpen(false)
            navigateTo('hero')
          }}
        >
          <img
            src="/kg-logo.png"
            alt="KG Logo"
            className="h-7 sm:h-[35px] w-auto object-contain transition-transform duration-200 group-hover:scale-105 dark:brightness-0 dark:invert"
          />
          <span className="flex items-center gap-1.5 text-base sm:text-lg font-bold tracking-tight text-black dark:text-white">
            <span className="font-mono text-violet-500 font-extrabold">&lt;/&gt;</span>
            <span>Khushi</span>
          </span>
        </Link>

        {/* Center: Free-standing text links with active horizontal underline */}
        <nav className="hidden md:flex items-center gap-5 lg:gap-8 xl:gap-10">
          {NAV_ITEMS.map((item) => {
            const isActive = currentActive === item.targetId
            return (
              <button
                key={item.label}
                type="button"
                onClick={() => handleNavClick(item.targetId)}
                className={`relative py-1 text-sm font-medium transition-colors duration-200 focus-ring ${
                  isActive
                    ? 'text-black dark:text-white font-semibold'
                    : 'text-black/60 dark:text-slate-400 hover:text-black dark:hover:text-white'
                }`}
              >
                <span>{item.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="nav-active-underline"
                    className="absolute -bottom-1.5 inset-x-0 h-[2.5px] rounded-full bg-gradient-to-r from-violet-500 via-indigo-500 to-purple-500 shadow-[0_0_10px_rgba(139,92,246,0.6)]"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            )
          })}
        </nav>

        {/* Right side: Socials + Theme Toggle + Hire Me CTA Button */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Desktop Socials */}
          <div className="hidden lg:flex items-center gap-3.5 border-r border-black/10 dark:border-white/10 pr-4">
            {socials.map((social) => (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.name}
                className="text-black/60 transition-all duration-200 hover:-translate-y-0.5 hover:text-violet-500 dark:text-white/60 dark:hover:text-violet-400 focus-ring rounded"
              >
                <SocialIcon icon={social.icon} size={20} />
              </a>
            ))}
          </div>

          <ThemeToggle />

          {/* Hire Me CTA Button */}
          <button
            type="button"
            onClick={() => navigateTo('contact')}
            className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-3.5 sm:px-5 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-white shadow-md shadow-violet-500/25 transition-all duration-200 hover:scale-105 hover:shadow-violet-500/40 active:scale-95 focus-ring whitespace-nowrap"
          >
            Hire Me
          </button>

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            aria-label="Toggle navigation menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-black/10 text-black/80 transition-colors hover:border-black/20 dark:border-white/15 dark:text-white/80 dark:hover:border-white/30 focus-ring md:hidden"
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
                    currentActive === item.targetId
                      ? 'bg-violet-500/10 text-violet-600 dark:bg-violet-500/20 dark:text-violet-300 font-bold'
                      : 'text-black/75 hover:bg-black/5 dark:text-white/75 dark:hover:bg-white/5'
                  }`}
                >
                  <span>{item.label}</span>
                  {currentActive === item.targetId && (
                    <span className="h-1.5 w-6 rounded-full bg-violet-500" />
                  )}
                </button>
              ))}

              {/* Mobile Socials */}
              <div className="flex items-center justify-between pt-4 mt-3 border-t border-black/10 dark:border-white/10 px-4">
                <div className="flex items-center gap-4">
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
                <button
                  type="button"
                  onClick={() => handleNavClick('contact')}
                  className="text-xs font-semibold text-violet-500 dark:text-violet-400 flex items-center"
                >
                  Hire Me
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
