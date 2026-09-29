import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  User,
  Briefcase,
  Award,
  GraduationCap,
  Download,
  CheckCircle2,
  ExternalLink,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react'
import Container from '@/components/ui/Container'
import SectionHeading from '@/components/ui/SectionHeading'
import Card3D from '@/components/ui/Card3D'
import { profile } from '@/data/profile'
import { useActiveSection } from '@/context/ActiveSectionContext'

const TABS = [
  { id: 'story', label: 'Background', icon: GraduationCap },
  { id: 'experience', label: 'Experience', icon: Briefcase },
  { id: 'achievements', label: 'Achievements', icon: Award },
]

export default function About() {
  const { navigateTo } = useActiveSection()
  const [activeTab, setActiveTab] = useState('story')
  const [imageError, setImageError] = useState(false)

  const aboutParagraphs = Array.isArray(profile.about)
    ? profile.about
    : [profile.about]

  return (
    <section id="about" className="relative overflow-hidden">
      <Container className="relative section-pad">
        <SectionHeading
          eyebrow="Profile"
          title="About Me"
          subtitle="A glimpse into my journey so far."
        />

        <div className="mt-8 sm:mt-12 grid grid-cols-1 md:grid-cols-[minmax(0,280px)_1fr] lg:grid-cols-[minmax(0,340px)_1fr] items-center gap-8 lg:gap-14 w-full min-w-0">
          {/* Left: 3D Photo Card with subtle cat-ear silhouette header */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="relative mx-auto w-full max-w-[210px] sm:max-w-[260px] md:max-w-[320px] min-w-0"
          >
            {/* Soft accent glow behind the photo */}
            <div
              aria-hidden="true"
              className="absolute -inset-6 -z-10 rounded-[2.5rem] opacity-50 blur-2xl"
              style={{
                background:
                  'radial-gradient(circle, var(--color-accent) 0%, transparent 70%)',
              }}
            />

            {/* Subtle Cat Ear Motif above the photo frame */}
            <div className="relative flex justify-between px-8 -mb-2 z-10 select-none pointer-events-none">
              <div className="w-5 h-4 bg-slate-900 border-t border-l border-white/20 rounded-tl-lg transform -rotate-12" />
              <div className="w-5 h-4 bg-slate-900 border-t border-r border-white/20 rounded-tr-lg transform rotate-12" />
            </div>

            <Card3D
              maxTilt={9}
              scale={1.03}
              className="surface aspect-[472/640] w-full overflow-hidden rounded-[2rem] shadow-xl border border-white/15 bg-slate-950/80"
            >
              {!imageError ? (
                <img
                  src={profile.photoUrl}
                  alt={profile.name}
                  onError={() => setImageError(true)}
                  style={{ transform: 'translateZ(15px)' }}
                  className="h-full w-full object-cover object-center transition-transform duration-500 hover:scale-105"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-black/[0.03] dark:bg-white/[0.03]">
                  <User size={64} className="text-black/20 dark:text-white/20" />
                </div>
              )}
            </Card3D>

            {/* Photo caption */}
            <div className="mt-4 flex items-center justify-between px-2">
              <span className="text-xs font-mono font-bold text-black/80 dark:text-white/80">
                {profile.name}
              </span>

              <a
                href={profile.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-violet-500 hover:text-violet-400 dark:text-violet-400 transition-colors focus-ring rounded"
              >
                <Download size={13} />
                <span>Resume</span>
              </a>
            </div>
          </motion.div>

          {/* Right: Interactive Bio & Resume Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col gap-5 sm:gap-6 w-full min-w-0"
          >
            {/* Category Selector Tabs */}
            <div className="w-full min-w-0 flex items-center gap-1.5 sm:gap-2 border-b border-black/10 dark:border-white/10 pb-2.5 overflow-x-auto no-scrollbar">
              {TABS.map((tab) => {
                const Icon = tab.icon
                const isActive = activeTab === tab.id
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`shrink-0 inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-200 whitespace-nowrap focus-ring ${
                      isActive
                        ? 'bg-violet-600 text-white shadow-md'
                        : 'text-black/60 hover:text-black dark:text-white/60 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
                    }`}
                  >
                    <Icon size={14} />
                    <span>{tab.label}</span>
                  </button>
                )
              })}
            </div>

            {/* Tab Contents */}
            <div className="w-full min-w-0 min-h-[240px]">
              <AnimatePresence mode="wait">
                {activeTab === 'story' && (
                  <motion.div
                    key="story"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                    className="flex flex-col gap-3.5 sm:gap-4 text-sm sm:text-base leading-relaxed text-black/75 dark:text-white/75 w-full min-w-0"
                  >
                    {aboutParagraphs.map((paragraph, index) => (
                      <p key={index} className="break-words">{paragraph}</p>
                    ))}

                    {/* Education Cards */}
                    <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-3 w-full min-w-0">
                      {profile.education?.map((edu, i) => (
                        <div
                          key={i}
                          className="p-3.5 sm:p-4 rounded-2xl border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] min-w-0 w-full"
                        >
                          <span className="text-xs font-mono text-cyan-500 font-semibold block truncate">
                            {edu.year} • {edu.score}
                          </span>
                          <h4 className="text-sm font-bold text-black dark:text-white mt-1 break-words">
                            {edu.degree}
                          </h4>
                          <p className="text-xs text-black/60 dark:text-white/60 mt-0.5 break-words">
                            {edu.institution}, {edu.location}
                          </p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {activeTab === 'experience' && (
                  <motion.div
                    key="experience"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                    className="flex flex-col gap-4 text-sm sm:text-base leading-relaxed text-black/75 dark:text-white/75 w-full min-w-0"
                  >
                    {profile.experience?.map((exp, idx) => (
                      <div
                        key={idx}
                        className="p-4 sm:p-5 rounded-2xl border border-violet-500/20 bg-violet-500/5 flex flex-col gap-3 w-full min-w-0"
                      >
                        {/* Header Row: Company/Role on left, Period badge & Open PDF on top right */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 w-full min-w-0">
                          <div className="min-w-0">
                            <h4 className="text-base font-bold text-black dark:text-white break-words">
                              {exp.company} — {exp.role}
                            </h4>
                            <span className="text-xs text-black/60 dark:text-white/60 block truncate">
                              {exp.location}
                            </span>
                          </div>

                          {/* Top Right Corner Controls */}
                          <div className="flex items-center gap-2 flex-wrap shrink-0">
                            <span className="text-xs font-mono font-semibold px-3 py-1 rounded-full bg-violet-500/15 text-violet-400 border border-violet-500/30 whitespace-nowrap">
                              {exp.period}
                            </span>
                            {exp.certificate && (
                              <a
                                href={exp.certificate.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 rounded-full bg-violet-600 hover:bg-violet-500 text-white px-3 py-1 text-xs font-semibold shadow-sm transition-all duration-200 hover:scale-105 focus-ring whitespace-nowrap"
                                title="Open Capgemini Fellowship Certificate PDF"
                              >
                                <span>Open PDF</span>
                                <ExternalLink size={12} />
                              </a>
                            )}
                          </div>
                        </div>

                        {/* Experience Highlights */}
                        <ul className="flex flex-col gap-2 mt-1 w-full min-w-0">
                          {exp.highlights.map((item, i) => (
                            <li
                              key={i}
                              className="flex items-start gap-2.5 text-xs sm:text-sm text-black/70 dark:text-white/70 min-w-0"
                            >
                              <CheckCircle2 size={15} className="text-violet-400 shrink-0 mt-0.5" />
                              <span className="break-words min-w-0 flex-1">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </motion.div>
                )}

                {activeTab === 'achievements' && (
                  <motion.div
                    key="achievements"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm sm:text-base w-full min-w-0"
                  >
                    {profile.achievements?.map((ach, i) => (
                      <div
                        key={i}
                        className="p-3.5 sm:p-4 rounded-2xl border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] flex items-start justify-between gap-3 min-w-0 w-full"
                      >
                        <div className="flex items-start gap-2.5 sm:gap-3 min-w-0 flex-1">
                          <Award size={18} className="text-cyan-400 shrink-0 mt-0.5" />
                          <span className="text-xs sm:text-sm text-black/80 dark:text-white/80 leading-relaxed font-medium break-words">
                            {ach}
                          </span>
                        </div>
                        {ach.includes('Capgemini') && (
                          <a
                            href="/capgemini-certificate.pdf"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="shrink-0 inline-flex items-center gap-1 rounded-full bg-violet-500/15 border border-violet-500/30 px-2.5 py-1 text-[11px] font-semibold text-violet-600 dark:text-violet-400 hover:bg-violet-500/25 transition-colors focus-ring whitespace-nowrap"
                            title="Open official Capgemini certificate PDF"
                          >
                            <span>Open PDF</span>
                            <ExternalLink size={11} />
                          </a>
                        )}
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* Navigation Stepper between sections */}
        <div className="mt-10 sm:mt-16 flex items-center justify-between border-t border-black/10 dark:border-white/10 pt-5 sm:pt-8 gap-2 w-full min-w-0">
          <button
            type="button"
            onClick={() => navigateTo('hero')}
            className="text-xs font-semibold text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white transition-colors flex items-center gap-1.5 focus-ring rounded-full px-2.5 sm:px-3 py-1.5 whitespace-nowrap shrink-0"
          >
            <ArrowLeft size={14} />
            <span>Home</span>
          </button>

          <button
            type="button"
            onClick={() => navigateTo('tech-stack')}
            className="inline-flex items-center gap-1.5 sm:gap-2 rounded-full bg-violet-600 hover:bg-violet-500 text-white px-3 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold shadow-md transition-all duration-200 hover:scale-105 focus-ring whitespace-nowrap shrink-0"
          >
            <span>Next: Technical Skills</span>
            <ArrowRight size={15} />
          </button>
        </div>
      </Container>
    </section>
  )
}
