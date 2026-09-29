import { createContext, useContext, useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const VALID_SECTIONS = ['hero', 'about', 'tech-stack', 'projects', 'contact']

const ActiveSectionContext = createContext({
  activeSection: 'hero',
  setActiveSection: () => {},
  navigateTo: () => {},
})

export function ActiveSectionProvider({ children }) {
  const location = useLocation()
  const navigate = useNavigate()

  const [activeSection, setActiveSection] = useState(() => {
    if (typeof window !== 'undefined' && window.location.hash) {
      const hash = window.location.hash.replace('#', '')
      if (VALID_SECTIONS.includes(hash)) return hash
    }
    return 'hero'
  })

  // Sync with browser URL hash & back/forward navigation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '')
      if (VALID_SECTIONS.includes(hash)) {
        setActiveSection(hash)
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } else if (!hash) {
        setActiveSection('hero')
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    }

    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  const navigateTo = (sectionId) => {
    if (!VALID_SECTIONS.includes(sectionId)) return

    setActiveSection(sectionId)

    if (location.pathname !== '/') {
      navigate(sectionId === 'hero' ? '/' : `/#${sectionId}`)
      window.scrollTo({ top: 0, behavior: 'instant' })
      return
    }

    try {
      if (sectionId === 'hero') {
        window.history.replaceState(null, '', window.location.pathname)
      } else {
        window.history.replaceState(null, '', `#${sectionId}`)
      }
    } catch {
      // safe fallback
    }

    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <ActiveSectionContext.Provider
      value={{
        activeSection,
        setActiveSection,
        navigateTo,
      }}
    >
      {children}
    </ActiveSectionContext.Provider>
  )
}

export function useActiveSection() {
  return useContext(ActiveSectionContext)
}
