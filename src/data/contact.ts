/**
 * AX6UUU Contact & Social Profile Configuration
 * ============================================================================
 * TO REPLACE DEMO CONTACT DETAILS WITH ASHUTOSH'S ACTUAL DETAILS:
 * 1. Set IS_DEMO_MODE = false below.
 * 2. Replace the demo placeholder strings in CONTACT_DETAILS below:
 *    - email: Ashutosh's real email address
 *    - whatsapp: Ashutosh's real WhatsApp phone number
 *    - instagram: Ashutosh's real Instagram handle or URL
 *    - youtube: Ashutosh's real YouTube channel URL or handle
 * ============================================================================
 */

/**
 * Configurable Demo Mode Flag:
 * - When true: displays demo placeholders without triggering fake links/navigation.
 * - When false: activates real navigation (mailto, WhatsApp link, Instagram, YouTube).
 */
export const IS_DEMO_MODE: boolean = true

export interface ContactData {
  email: string
  whatsapp: string
  instagram: string
  youtube: string
}

/**
 * Centralized Contact Configuration
 * Replace these demo placeholders with Ashutosh's actual contact information:
 */
export const CONTACT_DETAILS: ContactData = {
  // DEMO PLACEHOLDER: Replace with actual email, e.g. "ashutosh@ax6uuu.com"
  email: 'hello@ax6uuu.example',

  // DEMO PLACEHOLDER: Replace with actual WhatsApp number, e.g. "+91 98765 43210"
  whatsapp: '+91 90000 00000',

  // DEMO PLACEHOLDER: Replace with actual Instagram handle, e.g. "@ax6uuu"
  instagram: '@ax6uuu_demo',

  // DEMO PLACEHOLDER: Replace with actual YouTube channel handle or link, e.g. "@ax6uuu"
  youtube: '@ax6uuu_demo',
}

export interface ContactChannel {
  id: 'email' | 'whatsapp' | 'instagram' | 'youtube'
  number: string
  name: string
  detail: string
  descriptor: string
  href: string
  isDemo: boolean
}

export function getEditorialContactChannels(): ContactChannel[] {
  const isDemo = IS_DEMO_MODE

  const emailDetail = CONTACT_DETAILS.email.trim()
  const waDetail = CONTACT_DETAILS.whatsapp.trim()
  const igDetail = CONTACT_DETAILS.instagram.trim()
  const ytDetail = CONTACT_DETAILS.youtube.trim()

  return [
    {
      id: 'email',
      number: '01',
      name: 'EMAIL',
      detail: emailDetail,
      descriptor: 'Direct project inquiries & editorial briefs',
      href: isDemo ? '#' : `mailto:${emailDetail}`,
      isDemo,
    },
    {
      id: 'whatsapp',
      number: '02',
      name: 'WHATSAPP',
      detail: waDetail,
      descriptor: 'Fast messaging & availability check',
      href: isDemo
        ? '#'
        : waDetail.startsWith('http')
          ? waDetail
          : `https://wa.me/${waDetail.replace(/[^0-9]/g, '')}`,
      isDemo,
    },
    {
      id: 'instagram',
      number: '03',
      name: 'INSTAGRAM',
      detail: igDetail,
      descriptor: 'Visual stories & behind the scenes',
      href: isDemo
        ? '#'
        : igDetail.startsWith('http')
          ? igDetail
          : `https://instagram.com/${igDetail.replace('@', '')}`,
      isDemo,
    },
    {
      id: 'youtube',
      number: '04',
      name: 'YOUTUBE',
      detail: ytDetail,
      descriptor: 'Motion edits & published video cuts',
      href: isDemo
        ? '#'
        : ytDetail.startsWith('http')
          ? ytDetail
          : `https://youtube.com/${ytDetail.startsWith('@') ? ytDetail : `@${ytDetail}`}`,
      isDemo,
    },
  ]
}
