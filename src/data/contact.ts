/**
 * ax6uuu Contact & Profile Configuration
 * Ashutosh Sahu — Video Editor
 */

export const CONTACT_DETAILS = {
  email: 'ashutoshsahu1907@gmail.com',
  whatsapp: '+91 7849093212',
  whatsappNumber: '917849093212',
  x: '@ax6uuu',
  xUrl: 'https://x.com/ax6uuu',
}

export const FREE_SAMPLE_MESSAGE =
  "Hi Ashutosh! I came across your portfolio and would like to get a free sample edit. I have some footage I'd like you to work on. Please let me know how we can get started."

export const FREE_SAMPLE_WHATSAPP_URL = `https://wa.me/${CONTACT_DETAILS.whatsappNumber}?text=${encodeURIComponent(
  FREE_SAMPLE_MESSAGE
)}`

export interface ContactChannel {
  id: 'email' | 'whatsapp' | 'x'
  number: string
  name: string
  detail: string
  descriptor: string
  href: string
  external?: boolean
}

export function getEditorialContactChannels(): ContactChannel[] {
  return [
    {
      id: 'email',
      number: '01',
      name: 'EMAIL',
      detail: CONTACT_DETAILS.email,
      descriptor: 'Direct project inquiries & editorial briefs',
      href: `mailto:${CONTACT_DETAILS.email}`,
      external: false,
    },
    {
      id: 'whatsapp',
      number: '02',
      name: 'WHATSAPP',
      detail: CONTACT_DETAILS.whatsapp,
      descriptor: 'Fast messaging & availability check',
      href: `https://wa.me/${CONTACT_DETAILS.whatsappNumber}`,
      external: true,
    },
    {
      id: 'x',
      number: '03',
      name: 'X',
      detail: CONTACT_DETAILS.x,
      descriptor: 'Direct messages, updates & motion drops',
      href: CONTACT_DETAILS.xUrl,
      external: true,
    },
  ]
}
