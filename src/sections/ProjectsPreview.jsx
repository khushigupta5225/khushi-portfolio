import { useState, useEffect } from 'react'
import { motion, wrap } from 'framer-motion'
import { ChevronLeft, ChevronRight, ArrowUpRight, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import Container from '@/components/ui/Container'
import SectionHeading from '@/components/ui/SectionHeading'
import ProjectCard from '@/components/ui/ProjectCard'
import ProjectModal from '@/components/ui/ProjectModal'
import WhiskerDivider from '@/components/ui/WhiskerDivider'
import { projects } from '@/data/projects'

/**
 * ProjectsPreview: True Infinite Loop Showcase:
 * - Personal header tailored to Khushi Gupta's portfolio.
 * - Hardware-accelerated infinite carousel powered by Framer Motion.
 * - Zero bounce-back bug, zero scroll fighting, pure 60fps spring transitions.
 * - Active card expands with Client, Categories, Year, Live Link, and GitHub.
 * - Inactive cards are compact and smoothly glide into active focus on click.
 * - Interactive segmented pills & touch-drag swipe support.
 */
export default function ProjectsPreview() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedProject, setSelectedProject] = useState(null)
  const [dimensions, setDimensions] = useState({ cardWidth: 400, gap: 24 })

  // Responsive dimensions for seamless spacing
  useEffect(() => {
    function updateDimensions() {
      const width = window.innerWidth
      if (width < 640) {
        setDimensions({ cardWidth: Math.min(310, width - 44), gap: 16 })
      } else if (width < 1024) {
        setDimensions({ cardWidth: 350, gap: 20 })
      } else {
        setDimensions({ cardWidth: 410, gap: 26 })
      }
    }
    updateDimensions()
    window.addEventListener('resize', updateDimensions)
    return () => window.removeEventListener('resize', updateDimensions)
  }, [])

  const step = dimensions.cardWidth + dimensions.gap
  const activeProjectIdx = wrap(0, projects.length, currentIndex)

  const handleNext = () => {
    setCurrentIndex((prev) => prev + 1)
  }

  const handlePrev = () => {
    setCurrentIndex((prev) => prev - 1)
  }

  // Shortest-path navigation when clicking bottom indicator pills
  const handlePillClick = (targetIdx) => {
    const currentPill = wrap(0, projects.length, currentIndex)
    let diff = targetIdx - currentPill
    if (diff > 2) diff -= 4
    if (diff < -2) diff += 4
    setCurrentIndex((prev) => prev + diff)
  }

  // Render 7 relative slots around currentIndex: [-3, -2, -1, 0, 1, 2, 3]
  // Active card is at offset 0 (center).
  // Infinite looping is mathematical: currentIndex increments or decrements endlessly!
  const visibleOffsets = [-3, -2, -1, 0, 1, 2, 3]

  return (
    <section id="projects" className="relative overflow-hidden py-8 sm:py-12">
      <WhiskerDivider />

      {/* Header: Personal to Khushi's Developer Portfolio */}
      <Container className="px-6 sm:px-10 lg:px-24 pt-12 sm:pt-16 pb-2">
        <SectionHeading
          eyebrow="MY WORK"
          title="My Featured Projects"
          subtitle="A collection of ideas, projects, and solutions I’ve built along the way."
          align="center"
        />
      </Container>

      {/* Infinite Carousel Stage: Completely Open, Flowing Endlessly Across the Screen */}
      <div className="relative w-full overflow-hidden py-1 sm:py-2">
        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={(_, { offset, velocity }) => {
            const threshold = 40
            if (offset.x < -threshold || velocity.x < -300) {
              handleNext()
            } else if (offset.x > threshold || velocity.x > 300) {
              handlePrev()
            }
          }}
          className="relative w-full h-[510px] sm:h-[530px] flex items-center justify-center cursor-grab active:cursor-grabbing select-none"
        >
          {/* Centered Anchor for the Floating Cards */}
          <div className="relative w-0 h-full flex items-center justify-center">
            {visibleOffsets.map((offset) => {
              const virtualIndex = currentIndex + offset
              const projectIndex = wrap(0, projects.length, virtualIndex)
              const project = projects[projectIndex]
              const isActive = offset === 0

              return (
                <motion.div
                  key={virtualIndex}
                  initial={false}
                  animate={{
                    x: offset * step,
                    scale: isActive ? 1 : 0.93,
                    opacity:
                      Math.abs(offset) > 2
                        ? 0
                        : Math.abs(offset) === 2
                        ? 0.35
                        : isActive
                        ? 1
                        : 0.82,
                    zIndex: 20 - Math.abs(offset),
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 280,
                    damping: 28,
                    mass: 0.7,
                  }}
                  style={{
                    position: 'absolute',
                    width: `${dimensions.cardWidth}px`,
                    left: `-${dimensions.cardWidth / 2}px`,
                    pointerEvents: Math.abs(offset) > 2 ? 'none' : 'auto',
                  }}
                  onClick={() => {
                    if (isActive) {
                      setSelectedProject(project)
                    } else {
                      setCurrentIndex(virtualIndex)
                    }
                  }}
                >
                  <ProjectCard
                    project={project}
                    isCarousel={true}
                    isActive={isActive}
                    onActivate={() => setCurrentIndex(virtualIndex)}
                    onSelect={setSelectedProject}
                  />
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      </div>

      <Container>
        {/* Bottom Navigation & Segmented Indicator Controls */}
        <div className="mt-6 sm:mt-8 flex items-center justify-between max-w-sm sm:max-w-md mx-auto px-2">
          {/* Left Button */}
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous project"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-black/15 dark:border-white/15 bg-white dark:bg-[#151624] text-neutral-800 dark:text-white shadow-sm hover:bg-black/5 dark:hover:bg-white/10 transition-all duration-200 active:scale-95 focus-ring"
          >
            <ChevronLeft size={20} />
          </button>

          {/* Segmented 4-Project Indicator Pills */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {projects.map((p, idx) => {
              const isPillActive = activeProjectIdx === idx
              return (
                <button
                  key={p.name}
                  type="button"
                  onClick={() => handlePillClick(idx)}
                  aria-label={`Jump to project ${idx + 1}: ${p.shortTitle}`}
                  className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 focus-ring ${
                    isPillActive
                      ? 'w-10 sm:w-12 bg-neutral-900 dark:bg-white shadow-sm'
                      : 'w-5 sm:w-6 bg-black/20 dark:bg-white/20 hover:bg-black/40 dark:hover:bg-white/40'
                  }`}
                />
              )
            })}
          </div>

          {/* Right Button */}
          <button
            type="button"
            onClick={handleNext}
            aria-label="Next project"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-black/15 dark:border-white/15 bg-white dark:bg-[#151624] text-neutral-800 dark:text-white shadow-sm hover:bg-black/5 dark:hover:bg-white/10 transition-all duration-200 active:scale-95 focus-ring"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* View All Projects Full Specs Link */}
        <div className="mt-8 flex justify-center">
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors py-2 px-4 rounded-full border border-black/10 dark:border-white/10 hover:border-black/20 dark:hover:border-white/20 bg-white/40 dark:bg-black/40 backdrop-blur-sm"
          >
            <span>View All Detailed Architecture & Specs</span>
            <ArrowUpRight size={14} />
          </Link>
        </div>
      </Container>

      {/* Deep-Dive Project Modal */}
      <ProjectModal
        project={selectedProject}
        isOpen={Boolean(selectedProject)}
        onClose={() => setSelectedProject(null)}
      />
    </section>
  )
}
