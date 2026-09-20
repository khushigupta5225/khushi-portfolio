import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, CheckCircle2, Copy, Check } from 'lucide-react'
import Container from '@/components/ui/Container'
import Button from '@/components/ui/Button'
import WhiskerDivider from '@/components/ui/WhiskerDivider'
import { profile } from '@/data/profile'

const inputStyles =
  'w-full rounded-xl border border-black/10 bg-black/[0.02] px-4 py-3.5 text-base text-black placeholder:text-black/35 outline-none transition-colors focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/20 dark:border-white/10 dark:bg-white/[0.03] dark:text-white dark:placeholder:text-white/35'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState('idle') // idle | sending | sent
  const [isTyping, setIsTyping] = useState(false)
  const [copied, setCopied] = useState(false)

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setIsTyping(true)
  }

  function handleCopyEmail() {
    navigator.clipboard.writeText(profile.email)
    setCopied(true)
    setTimeout(() => setCopied(false), 2200)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) return

    setStatus('sending')

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          access_key: '56111162-d278-4eb7-a720-bc2ae51740fb',
          name: form.name,
          email: form.email,
          message: form.message,
          to_email: 'khushigupta82840@gmail.com',
          subject: `Portfolio Message from ${form.name}`,
        }),
      })

      const data = await res.json()
      if (data.success) {
        setStatus('sent')
      } else {
        window.location.href = `mailto:khushigupta82840@gmail.com?subject=Portfolio Inquiry from ${encodeURIComponent(
          form.name
        )}&body=${encodeURIComponent(form.message)}`
        setStatus('sent')
      }
    } catch {
      window.location.href = `mailto:khushigupta82840@gmail.com?subject=Portfolio Inquiry from ${encodeURIComponent(
        form.name
      )}&body=${encodeURIComponent(form.message)}`
      setStatus('sent')
    }
  }

  function handleReset() {
    setForm({ name: '', email: '', message: '' })
    setStatus('idle')
  }

  return (
    <section id="contact" className="relative overflow-hidden">
      <WhiskerDivider />

      <Container className="relative section-pad">
        <div className="mx-auto grid max-w-5xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          {/* Left Column: Headline, Email Card & Desk Cat Companion */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="flex flex-col justify-start gap-6 text-left"
          >
            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold uppercase tracking-widest text-violet-500 dark:text-violet-400">
                Get In Touch
              </span>
              <h2 className="text-4xl font-bold tracking-tight text-black sm:text-5xl dark:text-white">
                Let&apos;s build something great.
              </h2>
            </div>

            <p className="text-base sm:text-lg leading-relaxed text-black/70 dark:text-white/70">
              Have a question, a project opportunity, or want to say hello? My
              inbox is always open — I will get back to you as soon as possible.
            </p>

            {/* Quick Email Card with Copy Button */}
            <div className="flex items-center justify-between p-4 rounded-2xl border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.03] backdrop-blur-sm">
              <div className="flex flex-col">
                <span className="text-xs font-mono text-black/50 dark:text-white/40">
                  Direct Email
                </span>
                <a
                  href={`mailto:${profile.email}`}
                  className="text-sm sm:text-base font-semibold text-black dark:text-white hover:text-violet-500 dark:hover:text-violet-400 transition-colors"
                >
                  {profile.email}
                </a>
              </div>

              <button
                type="button"
                onClick={handleCopyEmail}
                title="Copy email to clipboard"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-black/10 dark:border-white/15 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-xs font-semibold text-black/75 dark:text-white/75 transition-colors focus-ring"
              >
                {copied ? (
                  <>
                    <Check size={14} className="text-emerald-500" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy size={14} />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>

            {/* Desk Typing Cat Companion */}
            <div className="mt-4 flex items-center gap-4 p-4 rounded-2xl border border-violet-500/20 bg-violet-500/5 select-none">
              <svg
                width="64"
                height="64"
                viewBox="0 0 70 70"
                className="shrink-0 drop-shadow"
              >
                {/* Desk Line */}
                <line x1="2" y1="58" x2="68" y2="58" className="stroke-slate-600 dark:stroke-slate-500" strokeWidth="2" />
                {/* Cat Body */}
                <ellipse cx="35" cy="42" rx="18" ry="14" className="fill-slate-800 dark:fill-slate-900 stroke-slate-700" strokeWidth="2" />
                {/* Ears */}
                <polygon points="22,30 16,16 30,24" className="fill-slate-800 dark:fill-slate-900 stroke-slate-700" strokeWidth="2" />
                <polygon points="48,30 54,16 40,24" className="fill-slate-800 dark:fill-slate-900 stroke-slate-700" strokeWidth="2" />
                {/* Head */}
                <circle cx="35" cy="30" r="14" className="fill-slate-800 dark:fill-slate-900 stroke-slate-700" strokeWidth="2" />
                {/* Eyes (react to typing / status) */}
                {status === 'sent' ? (
                  <g className="stroke-cyan-300" strokeWidth="2" strokeLinecap="round">
                    <path d="M 28 29 Q 31 26 34 29" />
                    <path d="M 38 29 Q 41 26 44 29" />
                  </g>
                ) : isTyping ? (
                  <g className="fill-cyan-400">
                    <circle cx="30" cy="28" r="2.2" />
                    <circle cx="40" cy="28" r="2.2" />
                  </g>
                ) : (
                  <g className="fill-cyan-400">
                    <circle cx="30" cy="28" r="1.8" />
                    <circle cx="40" cy="28" r="1.8" />
                  </g>
                )}
                {/* Nose & Mouth */}
                <polygon points="34,32 36,32 35,33.5" className="fill-pink-400" />
                {/* Forepaws on keyboard / desk */}
                <motion.ellipse
                  cx="28"
                  cy="54"
                  rx="4.5"
                  ry="3.5"
                  className="fill-slate-700 stroke-slate-600"
                  strokeWidth="1.5"
                  animate={isTyping ? { y: [0, -3, 0] } : {}}
                  transition={{ duration: 0.25, repeat: isTyping ? Infinity : 0 }}
                />
                <motion.ellipse
                  cx="42"
                  cy="54"
                  rx="4.5"
                  ry="3.5"
                  className="fill-slate-700 stroke-slate-600"
                  strokeWidth="1.5"
                  animate={isTyping ? { y: [-3, 0, -3] } : {}}
                  transition={{ duration: 0.25, repeat: isTyping ? Infinity : 0 }}
                />
              </svg>

              <div className="flex flex-col">
                <span className="text-xs font-bold text-black dark:text-white">
                  {status === 'sent'
                    ? 'Message received! 🐾'
                    : isTyping
                    ? 'Typing alongside you... ⌨️'
                    : 'Desk Companion'}
                </span>
                <span className="text-xs text-black/60 dark:text-white/60">
                  {status === 'sent'
                    ? 'Thank you for reaching out!'
                    : 'All messages are sent directly to Khushi.'}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
            className="surface relative overflow-hidden rounded-3xl p-6 sm:p-8"
          >
            <AnimatePresence mode="wait">
              {status === 'sent' ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col items-center justify-center gap-4 py-16 text-center"
                >
                  <CheckCircle2 size={44} className="text-emerald-500" />
                  <div>
                    <p className="text-xl font-bold text-black dark:text-white">
                      Message Sent Successfully!
                    </p>
                    <p className="mt-1.5 text-sm text-black/60 dark:text-white/60">
                      Thanks for reaching out — I&apos;ll get back to you
                      promptly.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="mt-2 text-sm font-semibold text-violet-500 hover:text-violet-400 underline underline-offset-4 focus-ring rounded"
                  >
                    Send another message
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  onSubmit={handleSubmit}
                  className="flex flex-col gap-4"
                >
                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="name"
                      className="text-sm font-semibold text-black/80 dark:text-white/80"
                    >
                      Your Name
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={form.name}
                      onFocus={() => setIsTyping(true)}
                      onBlur={() => setIsTyping(false)}
                      onChange={handleChange}
                      placeholder="e.g. Alex Smith"
                      className={inputStyles}
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="email"
                      className="text-sm font-semibold text-black/80 dark:text-white/80"
                    >
                      Email Address
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={form.email}
                      onFocus={() => setIsTyping(true)}
                      onBlur={() => setIsTyping(false)}
                      onChange={handleChange}
                      placeholder="alex@example.com"
                      className={inputStyles}
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="message"
                      className="text-sm font-semibold text-black/80 dark:text-white/80"
                    >
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      required
                      value={form.message}
                      onFocus={() => setIsTyping(true)}
                      onBlur={() => setIsTyping(false)}
                      onChange={handleChange}
                      placeholder="Tell me about your project or inquiry..."
                      className={`${inputStyles} resize-none`}
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    icon={Send}
                    disabled={status === 'sending'}
                    className="mt-2 w-full sm:w-auto"
                  >
                    {status === 'sending' ? 'Sending...' : 'Send Message'}
                  </Button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </Container>
    </section>
  )
}
