import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUpRight, Menu, X } from 'lucide-react'
import { Wordmark } from '../brand/Wordmark'
import { BrandAvatar } from '../brand/BrandAvatar'
import { Container } from '../layout/Container'
import { HIRE_ME_WHATSAPP_URL } from '../../data/contact'

interface NavLink {
  label: string
  href: string
}

const NAV_LINKS: NavLink[] = [
  { label: 'Work', href: '#work' },
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Contact', href: '#contact' },
]

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileMenuOpen])

  // Close mobile menu on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [mobileMenuOpen])

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? 'bg-[#F9F9FB]/80 backdrop-blur-md border-b border-black/[0.06] shadow-[0_4px_20px_rgba(0,0,0,0.02)]'
          : 'bg-[#F9F9FB]/75 backdrop-blur-md border-b border-black/[0.04]'
      }`}
    >
      <Container className="h-18 sm:h-20 flex items-center justify-between gap-4">
        {/* Left: Profile-Style Header [ X6 graphic avatar ] [ ax6uuu ] */}
        <div className="flex items-center gap-2.5 sm:gap-3.5 shrink-0">
          <a
            href="#"
            className="flex items-center gap-2 sm:gap-2.5 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric rounded-lg"
            aria-label="ax6uuu homepage"
          >
            <BrandAvatar size="md" className="group-hover:scale-105 transition-transform duration-200" />
            <Wordmark variant="default" size="sm" />
          </a>
          <span className="hidden lg:inline-block font-mono text-[10px] tracking-widest text-[#8E909E] uppercase pl-3 border-l border-black/10 select-none">
            Video Editor
          </span>
        </div>

        {/* Middle: Editorial Nav Links (Desktop) */}
        <nav
          className="hidden md:flex items-center gap-6 lg:gap-8"
          aria-label="Primary navigation"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="font-body text-sm font-medium text-[#5E606E] hover:text-[#0E0F14] transition-colors duration-200 relative py-1 focus-visible:outline-none focus-visible:text-[#0E0F14]"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right: HIRE ME CTA + Mobile Drawer Toggle */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* HIRE ME (Direct WhatsApp Link) */}
          <a
            href={HIRE_ME_WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 sm:px-5 py-2.5 rounded-full bg-[#0E0F14] text-white hover:bg-electric transition-colors duration-200 font-mono text-xs font-semibold tracking-wider uppercase shadow-[0_2px_8px_rgba(0,0,0,0.12)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric group"
          >
            <span>HIRE ME</span>
            <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>

          {/* Mobile Menu Button (44x44px touch target) */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg text-[#0E0F14] hover:bg-black/5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric cursor-pointer"
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </Container>

      {/* Mobile Menu Drawer Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="md:hidden fixed inset-x-0 top-18 bg-[#F9F9FB]/98 backdrop-blur-xl border-b border-black/10 shadow-2xl px-6 py-8 flex flex-col gap-6 z-50 max-h-[calc(100vh-4.5rem)] overflow-y-auto"
          >
            <nav className="flex flex-col gap-4" aria-label="Mobile navigation">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="font-display text-2xl font-medium text-[#0E0F14] hover:text-electric transition-colors py-2 border-b border-black/[0.04]"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            {/* Mobile Actions: HIRE ME (Direct WhatsApp Link) */}
            <div className="flex flex-col gap-3 pt-2">
              <a
                href={HIRE_ME_WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full inline-flex items-center justify-between px-5 py-3.5 rounded-full bg-[#0E0F14] text-white font-mono text-xs font-semibold tracking-wider uppercase hover:bg-electric transition-colors shadow-md"
              >
                <span>HIRE ME</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

export default Navbar
