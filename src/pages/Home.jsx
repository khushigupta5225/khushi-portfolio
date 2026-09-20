import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import PageTransition from '@/components/layout/PageTransition'
import Hero from '@/sections/Hero'
import About from '@/sections/About'
import TechStack from '@/sections/TechStack'
import ProjectsPreview from '@/sections/ProjectsPreview'
import Contact from '@/sections/Contact'

export default function Home() {
  const location = useLocation()

  // Smoothly scroll to target hash if arriving from another route
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '')
      const el = document.getElementById(id)
      if (el) {
        const timer = setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth' })
        }, 150)
        return () => clearTimeout(timer)
      }
    }
  }, [location])

  return (
    <PageTransition>
      <Hero />
      <About />
      <TechStack />
      <ProjectsPreview />
      <Contact />
    </PageTransition>
  )
}
