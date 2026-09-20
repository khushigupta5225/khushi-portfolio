import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import GradientBackground from '@/components/ui/GradientBackground'
import ScrollProgress from '@/components/ui/ScrollProgress'
import CatCursor from '@/components/ui/CatCursor'
import CatPreloader from '@/components/ui/CatPreloader'

export default function Layout() {
  return (
    <div className="relative min-h-screen bg-white text-black dark:bg-[#08080c] dark:text-white overflow-hidden selection:bg-violet-500 selection:text-white">
      {/* 1.2s Fast Cat Preloader (initial visit only) */}
      <CatPreloader />

      {/* Reading Scroll Progress Bar with Glowing Bead */}
      <ScrollProgress />

      {/* Subtle Desktop-Only Cat Cursor (disabled on touch & reduced-motion) */}
      <CatCursor />

      {/* Global 3D Ambient Background across all pages & sections */}
      <GradientBackground className="fixed inset-0 opacity-80 pointer-events-none" />

      {/* Fixed Header Navbar with Active Cat-Paw Indicator */}
      <Navbar />

      <main className="relative z-10 pt-16">
        <Outlet />
      </main>

      <Footer />
    </div>
  )
}
