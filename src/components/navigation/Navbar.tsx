import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUpRight, Menu, X } from 'lucide-react'
import { Wordmark } from '../brand/Wordmark'
import { Container } from '../layout/Container'
import { Button } from '../ui/Button'

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
      className={`sticky top-0 z-40 w-full transition-colors duration-300 ${
        isScrolled
          ? 'bg-[#F9F9FB]/90 backdrop-blur-md border-b border-black/[0.08] shadow-[0_4px_24px_rgba(0,0,0,0.03)]'
          : 'bg-transparent border-b border-black/[0.06]'
      }`}
    >
      <Container className="h-18 sm:h-20 flex items-center justify-between">
        {/* Left: Brand Wordmark + Professional Descriptor */}
        <div className="flex items-center gap-3 sm:gap-4">
          <a
            href="#"
            className="flex items-center gap-3 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric rounded-[4px]"
            aria-label="AX6UUU Homepage"
          >
            <Wordmark variant="default" size="sm" />
          </a>
          <span className="hidden sm:inline-block font-mono text-[10px] tracking-widest text-[#8E909E] uppercase pl-3 sm:pl-4 border-l border-black/10 select-none">
            Video Editor
          </span>
        </div>

        {/* Center: Editorial Nav Links (Desktop) */}
        <nav
          className="hidden md:flex items-center gap-8 lg:gap-10"
          aria-label="Primary navigation"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="font-body text-sm font-normal text-[#5E606E] hover:text-[#0E0F14] transition-colors duration-200 relative py-1 focus-visible:outline-none focus-visible:text-[#0E0F14]"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right: CTA & Mobile Toggle */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:inline-flex">
            <Button
              variant="solid"
              size="sm"
              href="#contact"
              rightIcon={
                <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              }
              className="group text-xs font-mono tracking-wider uppercase"
            >
              Let's Talk
            </Button>
          </div>

          {/* Mobile Menu Button (44x44px touch target) */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden inline-flex items-center justify-center w-11 h-11 rounded-[6px] text-[#0E0F14] hover:bg-black/5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric cursor-pointer"
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
            className="md:hidden fixed inset-x-0 top-18 bg-[#F9F9FB]/98 backdrop-blur-xl border-b border-black/10 shadow-2xl px-6 py-8 flex flex-col gap-6"
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

            <div className="pt-2">
              <Button
                variant="solid"
                size="md"
                href="#contact"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full justify-between"
                rightIcon={<ArrowUpRight className="w-4 h-4" />}
              >
                Let's Talk
              </Button>
            </div>

            <div className="pt-2 text-xs font-mono tracking-widest text-[#8E909E] uppercase flex items-center justify-between">
              <span>ASHUTOSH SAHU</span>
              <span>2026</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

export default Navbar
