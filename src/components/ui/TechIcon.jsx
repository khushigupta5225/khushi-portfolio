import {
  SiReact,
  SiJavascript,
  SiTailwindcss,
  SiHtml5,
  SiNodedotjs,
  SiExpress,
  SiGit,
  SiGithub,
  SiPython,
  SiSpringboot,
  SiPostman,
  SiDocker,
  SiApachemaven,
  SiMysql,
  SiPostgresql,
  SiMongodb,
  SiSqlite,
  SiPrisma,
  SiNextdotjs,
  SiFastapi,
  SiRedux,
} from 'react-icons/si'
import { FaJava } from 'react-icons/fa6'
import {
  Binary,
  Boxes,
  Database,
  Network,
  LayoutGrid,
  Cpu,
} from 'lucide-react'

const ICONS = {
  react: SiReact,
  javascript: SiJavascript,
  tailwind: SiTailwindcss,
  htmlcss: SiHtml5,
  nodejs: SiNodedotjs,
  express: SiExpress,
  git: SiGit,
  github: SiGithub,
  python: SiPython,
  java: FaJava,
  springboot: SiSpringboot,
  postman: SiPostman,
  docker: SiDocker,
  maven: SiApachemaven,
  sql: SiMysql,
  mysql: SiMysql,
  postgresql: SiPostgresql,
  mongodb: SiMongodb,
  sqlite: SiSqlite,
  prisma: SiPrisma,
  nextjs: SiNextdotjs,
  fastapi: SiFastapi,
  redux: SiRedux,
  microservices: Cpu,
  dsa: Binary,
  oop: Boxes,
  dbms: Database,
  restapi: Network,
  mvc: LayoutGrid,
}

export default function TechIcon({ icon, size = 20, className = '' }) {
  const Icon = ICONS[icon]
  if (!Icon) return <Cpu size={size} className={className} />
  return <Icon size={size} className={className} />
}
