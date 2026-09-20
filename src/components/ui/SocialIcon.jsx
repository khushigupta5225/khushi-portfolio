import { SiGithub, SiLeetcode } from 'react-icons/si'
import { FaLinkedin } from 'react-icons/fa6'

const ICONS = {
  github: SiGithub,
  linkedin: FaLinkedin,
  leetcode: SiLeetcode,
}

export default function SocialIcon({ icon, size = 20, className = '' }) {
  const Icon = ICONS[icon]
  if (!Icon) return null
  return <Icon size={size} className={className} />
}
