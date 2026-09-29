import { motion, AnimatePresence } from 'framer-motion'
import PageTransition from '@/components/layout/PageTransition'
import Hero from '@/sections/Hero'
import About from '@/sections/About'
import TechStack from '@/sections/TechStack'
import ProjectsPreview from '@/sections/ProjectsPreview'
import Contact from '@/sections/Contact'
import { useActiveSection } from '@/context/ActiveSectionContext'

export default function Home() {
  const { activeSection } = useActiveSection()

  return (
    <PageTransition>
      <div className="relative min-h-[calc(100vh-4rem)] w-full overflow-x-clip">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="w-full"
          >
            {activeSection === 'hero' && <Hero />}
            {activeSection === 'about' && <About />}
            {activeSection === 'tech-stack' && <TechStack />}
            {activeSection === 'projects' && <ProjectsPreview />}
            {activeSection === 'contact' && <Contact />}
          </motion.div>
        </AnimatePresence>
      </div>
    </PageTransition>
  )
}
