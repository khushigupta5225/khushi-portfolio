import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, ArrowLeft } from 'lucide-react'
import SectionHeading from '@/components/ui/SectionHeading'
import TechIcon from '@/components/ui/TechIcon'
import Card3D from '@/components/ui/Card3D'
import { techStack } from '@/data/techStack'
import { useActiveSection } from '@/context/ActiveSectionContext'

export default function TechStack() {
  const { navigateTo } = useActiveSection()
  const [selectedCategory, setSelectedCategory] = useState('All')

  const categories = ['All', ...techStack.map((g) => g.category)]

  const filteredGroups =
    selectedCategory === 'All'
      ? techStack
      : techStack.filter((g) => g.category === selectedCategory)

  return (
    <section id="tech-stack" className="relative overflow-hidden w-full">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 section-pad">
        <SectionHeading
          eyebrow="Capabilities"
          title="Technical Skills"
          subtitle="Technologies I use to build, experiment, and solve problems."
          align="center"
        />

        {/* Category Filter Pills */}
        <div className="mt-8 sm:mt-10 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-[11px] sm:text-xs font-semibold tracking-wider uppercase transition-all duration-200 focus-ring whitespace-nowrap ${
                  isSelected
                    ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/25 scale-105'
                    : 'border border-black/10 dark:border-white/10 text-black/70 dark:text-white/70 hover:border-black/25 dark:hover:border-white/30 hover:bg-black/5 dark:hover:bg-white/5'
                }`}
              >
                {cat}
              </button>
            )
          })}
        </div>

        {/* Cards Grid */}
        <motion.div
          layout
          className={`mt-12 grid gap-6 w-full ${
            filteredGroups.length === 1
              ? 'max-w-md mx-auto grid-cols-1'
              : 'sm:grid-cols-2 lg:grid-cols-4'
          }`}
        >
          <AnimatePresence mode="popLayout">
            {filteredGroups.map((group) => (
              <motion.div
                layout
                key={group.category}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.35 }}
                className="w-full h-full"
              >
                <Card3D
                  maxTilt={8}
                  scale={1.02}
                  className={`flex flex-col justify-between overflow-hidden rounded-[1.8rem] sm:rounded-[2.2rem] border border-white/15 bg-gradient-to-b ${
                    group.bgColor || 'from-slate-800/80 to-slate-900/95'
                  } p-5 sm:p-7 shadow-2xl backdrop-blur-xl transition-colors duration-300 hover:border-violet-400/50 hover:shadow-violet-500/15 w-full h-full`}
                >
                  <div>
                    <h3
                      style={{ transform: 'translateZ(18px)' }}
                      className="mb-4 sm:mb-6 text-xs font-bold uppercase tracking-wider text-cyan-300"
                    >
                      {group.category}
                    </h3>

                    <div className="grid grid-cols-1 gap-2 sm:gap-2.5">
                      {group.items.map((item) => (
                        <div
                          key={item.name}
                          className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/40 px-3 sm:px-3.5 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold text-slate-100 shadow-sm transition-all duration-200 hover:border-violet-400/40 hover:bg-black/60 hover:translate-x-1"
                        >
                          <span
                            style={{ color: item.color }}
                            className="shrink-0 flex items-center justify-center"
                          >
                            <TechIcon icon={item.icon} size={18} />
                          </span>
                          <span className="whitespace-normal leading-snug">
                            {item.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card3D>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Navigation Stepper between sections */}
        <div className="mt-12 sm:mt-16 flex items-center justify-between border-t border-black/10 dark:border-white/10 pt-6 sm:pt-8 gap-2">
          <button
            type="button"
            onClick={() => navigateTo('about')}
            className="text-xs font-semibold text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white transition-colors flex items-center gap-1.5 focus-ring rounded-full px-3 py-1.5 whitespace-nowrap"
          >
            <ArrowLeft size={14} />
            <span>About Me</span>
          </button>

          <button
            type="button"
            onClick={() => navigateTo('projects')}
            className="inline-flex items-center gap-1.5 sm:gap-2 rounded-full bg-violet-600 hover:bg-violet-500 text-white px-3.5 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold shadow-md transition-all duration-200 hover:scale-105 focus-ring whitespace-nowrap"
          >
            <span>Next: Featured Projects</span>
            <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </section>
  )
}
