import { ArrowUp } from 'lucide-react'
import Container from '@/components/ui/Container'
import SocialIcon from '@/components/ui/SocialIcon'
import CatFooterScene from '@/components/ui/CatFooterScene'
import { profile, socials } from '@/data/profile'

export default function Footer() {
  const year = new Date().getFullYear()

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="relative overflow-hidden pt-12 sm:pt-16 md:pt-20">
      {/* Animated 5-Cat Hand-Drawn Scene standing directly on top of the footer line */}
      <CatFooterScene />

      {/* The Single Horizontal Footer Line (acting as the physical floor for the cats) */}
      <div className="w-full border-t border-black/10 dark:border-white/10" />

      {/* Copyright text, links and back-to-top below the line */}
      <Container className="flex flex-col items-center gap-4 sm:gap-6 px-4 py-6 sm:py-8 sm:flex-row sm:justify-between sm:px-8 lg:px-16">
        <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
          <p className="text-xs sm:text-sm text-black/60 dark:text-white/40">
            © {year} {profile.name}. All rights reserved.
          </p>
        </div>

        <div className="flex items-center gap-6">
          {/* Social Links */}
          <div className="flex items-center gap-4">
            {socials.map((social) => (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.name}
                className="text-black/50 transition-colors hover:text-violet-500 dark:text-white/40 dark:hover:text-violet-400 focus-ring rounded"
              >
                <SocialIcon icon={social.icon} size={18} />
              </a>
            ))}
          </div>

          {/* Back to top button */}
          <button
            type="button"
            onClick={scrollToTop}
            aria-label="Back to top"
            title="Back to top"
            className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-black/60 hover:text-black dark:text-white/50 dark:hover:text-white transition-colors focus-ring rounded-full px-3 py-1 border border-black/10 dark:border-white/10 hover:border-violet-500/40"
          >
            <span>Top</span>
            <ArrowUp size={13} />
          </button>
        </div>
      </Container>
    </footer>
  )
}
