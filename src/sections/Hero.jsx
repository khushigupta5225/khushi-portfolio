import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Download, ChevronDown, Mail } from 'lucide-react'
import Container from '@/components/ui/Container'
import Button from '@/components/ui/Button'
import Card3D from '@/components/ui/Card3D'
import InteractiveCatHero from '@/components/ui/InteractiveCatHero'
import { profile } from '@/data/profile'
import { useActiveSection } from '@/context/ActiveSectionContext'

const ROLES = ['Software Developer', 'Java Developer', 'Creative Developer']

function useRoleTypewriter() {
  const [roleIndex, setRoleIndex] = useState(0)
  const [text, setText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const fullRole = ROLES[roleIndex]

    if (!isDeleting && text === fullRole) {
      const pauseTimer = setTimeout(() => setIsDeleting(true), 1900)
      return () => clearTimeout(pauseTimer)
    }

    if (isDeleting && text === '') {
      const switchTimer = setTimeout(() => {
        setIsDeleting(false)
        setRoleIndex((prev) => (prev + 1) % ROLES.length)
      }, 300)
      return () => clearTimeout(switchTimer)
    }

    const timer = setTimeout(
      () => {
        setText((current) =>
          isDeleting
            ? fullRole.substring(0, current.length - 1)
            : fullRole.substring(0, current.length + 1)
        )
      },
      isDeleting ? 35 : 75
    )

    return () => clearTimeout(timer)
  }, [text, isDeleting, roleIndex])

  return text
}

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] },
  },
}

export default function Hero() {
  const { navigateTo } = useActiveSection()
  const displayedRole = useRoleTypewriter()
  const [reactionTarget, setReactionTarget] = useState(null)

  return (
    <section
      id="hero"
      className="relative z-20 flex min-h-[calc(100vh-4rem)] items-center justify-center py-8 sm:py-12 md:py-0"
    >
      <Container className="relative px-4 sm:px-8 lg:px-16">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="mx-auto grid max-w-6xl items-center gap-8 sm:gap-12 md:grid-cols-[1.15fr_0.85fr] lg:gap-16"
        >
          {/* Left Text Content */}
          <div className="flex flex-col items-start gap-5 sm:gap-6 text-left">
            {/* Status / Role Pill */}
            <motion.div
              variants={item}
              className="inline-flex items-center gap-2.5 rounded-full border border-violet-500/30 bg-violet-500/10 px-3.5 sm:px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-violet-400 dark:text-violet-300"
            >
              <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="inline-block whitespace-nowrap min-w-[160px] sm:min-w-[190px]">
                {displayedRole}
              </span>
            </motion.div>

            {/* Headline */}
            <motion.div variants={item} className="flex flex-col gap-1 sm:gap-1.5">
              <span className="text-base font-medium text-black/60 sm:text-xl dark:text-white/60">
                Hi, I&apos;m
              </span>
              <h1 className="text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-black dark:text-white">
                <span className="inline-block bg-gradient-to-r from-violet-400 via-cyan-400 to-pink-400 bg-clip-text text-transparent">
                  Khushi
                </span>{' '}
                <span className="inline-block">Gupta</span>
              </h1>
            </motion.div>

            {/* Intro paragraph */}
            <motion.p
              variants={item}
              className="max-w-xl text-base leading-relaxed text-black/75 sm:text-lg dark:text-white/75"
            >
              {profile.intro}
            </motion.p>

            {/* Action CTA Buttons */}
            <motion.div
              variants={item}
              className="mt-2 flex flex-wrap items-center gap-4"
            >
              <div
                onMouseEnter={() => setReactionTarget('resume')}
                onMouseLeave={() => setReactionTarget(null)}
              >
                <Button href={profile.resumeUrl} variant="primary" icon={Download}>
                  Resume
                </Button>
              </div>

              <div
                onMouseEnter={() => setReactionTarget('projects')}
                onMouseLeave={() => setReactionTarget(null)}
              >
                <Button onClick={() => navigateTo('projects')} variant="secondary" icon={ArrowRight}>
                  Projects
                </Button>
              </div>

              <div
                onMouseEnter={() => setReactionTarget('contact')}
                onMouseLeave={() => setReactionTarget(null)}
              >
                <button
                  type="button"
                  onClick={() => navigateTo('contact')}
                  className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-medium text-black/70 hover:text-black dark:text-white/70 dark:hover:text-white transition-colors focus-ring"
                >
                  <Mail size={16} />
                  <span>Get in touch</span>
                </button>
              </div>
            </motion.div>
          </div>

          {/* Right Hero: Card3D Mascot + Interactive SVG Cat Companion */}
          <motion.div
            variants={item}
            className="relative flex flex-col items-center justify-center gap-4 order-first md:order-last"
          >
            {/* 3D Tilt Mascot Card */}
            <div className="relative">
              <Card3D
                maxTilt={10}
                scale={1.03}
                className="relative flex h-52 w-52 xs:h-60 xs:w-60 sm:h-72 sm:w-72 md:h-80 md:w-80 items-center justify-center overflow-hidden rounded-[1.8rem] sm:rounded-[2.2rem] border border-slate-200/90 dark:border-white/15 bg-white/95 dark:bg-slate-950/80 p-2.5 sm:p-3 shadow-[0_12px_32px_rgba(0,0,0,0.07),0_2px_8px_rgba(0,0,0,0.04)] dark:shadow-2xl backdrop-blur-xl group transition-all duration-500"
              >
                <div
                  style={{ transform: 'translateZ(24px)' }}
                  className="relative z-10 h-full w-full rounded-2xl overflow-hidden transition-transform duration-500 group-hover:scale-105"
                >
                  {/* Light Mode: Clean light/off-white background with dark cat & text and preserved colored details */}
                  <img
                    src="/purrgrammer-light.png"
                    alt="Purrgrammer pixel art mascot - light mode"
                    className="absolute inset-0 h-full w-full rounded-2xl object-cover opacity-100 dark:opacity-0 transition-opacity duration-500 pointer-events-none"
                  />
                  {/* Dark Mode: Original unchanged artwork */}
                  <img
                    src="/purrgrammer.jpg"
                    alt="Purrgrammer pixel art mascot"
                    className="absolute inset-0 h-full w-full rounded-2xl object-cover opacity-0 dark:opacity-95 transition-opacity duration-500 pointer-events-none"
                  />
                </div>
              </Card3D>

              {/* Interactive Vector Companion Cat perched at the corner */}
              <div className="absolute -bottom-5 -right-2 sm:-bottom-8 sm:-right-5 z-40">
                <InteractiveCatHero reactionTarget={reactionTarget} />
              </div>
            </div>
          </motion.div>
        </motion.div>
      </Container>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 sm:block"
      >
        <button
          type="button"
          onClick={() => navigateTo('about')}
          aria-label="View About section"
          className="text-black/40 hover:text-black dark:text-white/40 dark:hover:text-white transition-colors focus-ring rounded-full p-1"
        >
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ChevronDown size={22} />
          </motion.div>
        </button>
      </motion.div>
    </section>
  )
}
