/**
 * ax6uuu Contact & Profile Configuration
 * Ashutosh Sahu — Video Editor
 */

export const CONTACT_DETAILS = {
  email: 'ashutoshsahu1907@gmail.com',
  whatsapp: '+91 7849093212',
  whatsappNumber: '917849093212',
  x: '@x6visuals',
  xUrl: 'https://x.com/x6visuals',
}

export const EMAIL_PREFILLED_MAILTO =
  'mailto:ashutoshsahu1907@gmail.com?subject=Video%20Editing%20Project%20Inquiry&body=Hi%20Ashutosh%2C%0A%0AI%20came%20across%20your%20portfolio%20and%20I%27m%20interested%20in%20your%20video%20editing%20services.%0A%0AI%27d%20like%20to%20discuss%20a%20project%20with%20you.%20Please%20let%20me%20know%20how%20we%20can%20get%20started.%0A%0ALooking%20forward%20to%20hearing%20from%20you.%0A%0AThanks!'

export const HIRE_ME_MESSAGE =
  'Hi Ashutosh! I came across your portfolio and would like to discuss a video editing project.'

export const HIRE_ME_WHATSAPP_URL = `https://wa.me/${CONTACT_DETAILS.whatsappNumber}?text=${encodeURIComponent(
  HIRE_ME_MESSAGE
)}`

export const FREE_SAMPLE_MESSAGE =
  "Hi Ashutosh! I came across your portfolio and would like to get a free sample edit. I have some footage I'd like you to work on. Please let me know how we can get started."

export const FREE_SAMPLE_WHATSAPP_URL = `https://wa.me/${CONTACT_DETAILS.whatsappNumber}?text=${encodeURIComponent(
  FREE_SAMPLE_MESSAGE
)}`

export interface ContactChannel {
  id: 'email' | 'whatsapp' | 'x'
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
      name: 'EMAIL',
      detail: CONTACT_DETAILS.email,
      descriptor: 'Direct project inquiries & editorial briefs',
      href: EMAIL_PREFILLED_MAILTO,
      external: false,
    },
    {
      id: 'whatsapp',
      name: 'WHATSAPP',
      detail: CONTACT_DETAILS.whatsapp,
      descriptor: 'Fast messaging & availability check',
      href: HIRE_ME_WHATSAPP_URL,
      external: true,
    },
    {
      id: 'x',
      name: 'X',
      detail: CONTACT_DETAILS.x,
      descriptor: 'Direct messages, updates & motion drops',
      href: CONTACT_DETAILS.xUrl,
      external: true,
    },
  ]
}
