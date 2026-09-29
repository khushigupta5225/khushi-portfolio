import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import PageTransition from '@/components/layout/PageTransition'
import Container from '@/components/ui/Container'
import SectionHeading from '@/components/ui/SectionHeading'
import ProjectCard from '@/components/ui/ProjectCard'
import ProjectModal from '@/components/ui/ProjectModal'
import { projects } from '@/data/projects'

const grid = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
}

export default function Projects() {
  const [selectedProject, setSelectedProject] = useState(null)

  return (
    <PageTransition>
      <section className="relative overflow-hidden section-pad min-h-screen">
        <Container className="px-4 sm:px-8 lg:px-16">
          <div className="mb-6 sm:mb-8">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-black/60 hover:text-black dark:text-white/60 dark:hover:text-white transition-colors focus-ring rounded"
            >
              <ArrowLeft size={16} />
              <span>Back to Overview</span>
            </Link>
          </div>

          <SectionHeading
            eyebrow="MY WORK"
            title="Things I've Built"
            subtitle="A collection of ideas, projects, and solutions I’ve built along the way."
          />

          <motion.div
            variants={grid}
            initial="hidden"
            animate="show"
            className="mt-10 sm:mt-14 grid gap-6 sm:gap-8 md:grid-cols-2 max-w-6xl mx-auto"
          >
            {projects.map((project) => (
              <ProjectCard
                key={project.name}
                project={project}
                onSelect={setSelectedProject}
              />
            ))}
          </motion.div>
        </Container>
      </section>

      {/* Project Deep Dive Modal */}
      <ProjectModal
        project={selectedProject}
        isOpen={Boolean(selectedProject)}
        onClose={() => setSelectedProject(null)}
      />
    </PageTransition>
  )
}
