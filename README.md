# ax6uuu — Video Editor Portfolio

> **Ashutosh Sahu** — Creative video editor specializing in high-retention short-form edits, long-form documentary storytelling, and cinematic visual pacing.

Official portfolio website built with modern React, TypeScript, Tailwind CSS v4, and Framer Motion.

---

## Overview

`ax6uuu` is an editorial portfolio designed to showcase short-form and long-form video editing projects. The interface follows clean typography, balanced spacing, and purposeful motion inspired by premium creative studios.

### Live Demo & Deployment
- **Framework**: React 19 + Vite 8
- **Platform**: Vercel-ready with zero-config deployment
- **Brand Identity**: Warm ivory canvas (`#F9F9FB`), near-black ink (`#0E0F14`), and vibrant electric blue accent (`#263BFF`)

---

## Features

- **Profile-Led Fixed Navigation**: Sticky backdrop-blurred navigation featuring the authentic circular X6 avatar badge and custom vector `ax6uuu` wordmark.
- **Simultaneous Inline Previews**: Short-form video cards (9:16 portrait) with independent Intersection Observers that autoplay muted previews simultaneously when visible in the viewport and pause upon exit.
- **Long-Form Narrative Spotlight**: Dedicated 16:9 landscape cut section optimized for narrative pacing and documentary structure.
- **Cinema Video Modal**: Distraction-free modal with persistent ambient blurred thumbnail backdrop, smooth spring transitions, keyboard navigation (`Escape`), and backdrop click-to-close.
- **Integrated About & Philosophy**: Two-column editorial bio paired with three core cutting principles: *Story First*, *Rhythm Matters*, and *Details Define the Cut*.
- **Connected Services Ledger**: Three specialized post-production services with capability badges and clean hover interactions.
- **Campaign Free Sample CTA**: Dark high-contrast section with animated accent line and direct WhatsApp integration with prefilled inquiry message.
- **Editorial Split Contact & Footer**: Clean two-column layout connecting directly to Email, WhatsApp, and X with copy and smooth back-to-top interaction.
- **Full Responsive Adaptation**: Engineered and audited across mobile (375px, 390px), tablet (768px), laptop (1280px, 1366px), and desktop (1440px, 1920px).
- **Accessibility & Motion Preferences**: Fully supports `prefers-reduced-motion` and keyboard tab navigation.

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) |
| **Build Tool** | [Vite 8](https://vite.dev/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) with `@tailwindcss/vite` |
| **Motion & Animation** | [Framer Motion](https://www.framer.com/motion/) + [GSAP](https://gsap.com/) |
| **Smooth Scrolling** | [Lenis](https://lenis.darkroom.engineering/) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Typography** | [Instrument Sans](https://fonts.google.com/specimen/Instrument+Sans) |

---

## Project Structure

```text
ax6uuu-portfolio/
├── public/
│   ├── brand/
│   │   ├── ax6uuu-wordmark.svg          # Authentic lowercase vector wordmark
│   │   ├── ax6uuu-wordmark-electric.svg # Electric blue wordmark variant
│   │   ├── x6-avatar.jpg                # Original X6 graphic avatar asset
│   │   ├── x6-avatar.png                # Transparent high-res avatar
│   │   └── x6-avatar.svg                # Vector avatar asset
│   ├── favicon.svg                      # Brand electric blue favicon
│   └── index.html                       # HTML entry point with OpenGraph & Twitter metadata
├── src/
│   ├── assets/                          # Static assets and icons
│   ├── components/
│   │   ├── about/                       # About bio and philosophy principles
│   │   ├── brand/                       # BrandAvatar and Wordmark vector components
│   │   ├── contact/                     # Editorial two-column Contact and Footer
│   │   ├── cta/                         # FreeSampleCta campaign section
│   │   ├── hero/                        # Hero introduction and VideoGallery
│   │   ├── layout/                      # Container and Section wrappers
│   │   ├── motion/                      # SmoothScroll (Lenis) and TextReveal
│   │   ├── navigation/                  # Fixed Navbar with mobile drawer
│   │   ├── services/                    # Services disciplines ledger
│   │   ├── ui/                          # Button, Badge, FilmGrain, Typography
│   │   └── video/                       # VideoModal cinema lightbox
│   ├── data/
│   │   ├── contact.ts                   # Channels, WhatsApp numbers, prefilled messages
│   │   ├── projects.ts                  # Short-form and long-form video IDs & metadata
│   │   └── services.ts                  # Post-production capabilities & descriptions
│   ├── lib/
│   │   └── animations.ts                # Shared cinematic easing curves & durations
│   ├── App.tsx                          # Root application layout
│   ├── index.css                        # Global Tailwind theme tokens & reset
│   └── main.tsx                         # React entry point
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18.0.0 or higher)
- npm or yarn or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/rajtilak123/ax6uuu-portfolio.git

# Navigate to the project directory
cd ax6uuu-portfolio

# Install dependencies
npm install
```

### Development

Start the local development server:

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Production Build

Create an optimized production bundle:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

### Code Quality & Linting

```bash
# Run TypeScript type-checking
npx tsc -b

# Run ESLint
npm run lint
```

---

## Deployment

### Vercel Deployment

This project is optimized for deployment on [Vercel](https://vercel.com):

1. Push your repository to GitHub.
2. In the Vercel Dashboard, import the `ax6uuu-portfolio` repository.
3. Vercel automatically detects the Vite framework settings:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
4. Click **Deploy**.

---

## Video Projects Showcase

| # | Title | Format | Aspect Ratio | YouTube ID |
|---|---|---|---|---|
| **01** | Project 01 | Short-Form Vertical Cut | 9:16 | `aC6hTlEIdes` |
| **02** | Project 02 | Short-Form Vertical Cut | 9:16 | `nokkwYvOagg` |
| **03** | Project 03 | Short-Form Vertical Cut | 9:16 | `LsxwZsXOTw0` |
| **04** | Project 04 | Long-Form Documentary | 16:9 | `bg4IO3U73p4` |

---

## Contact

- **Ashutosh Sahu**
- **Email**: [ashutoshsahu1907@gmail.com](mailto:ashutoshsahu1907@gmail.com)
- **WhatsApp**: [+91 7849093212](https://wa.me/917849093212)
- **X (Twitter)**: [@ax6uuu](https://x.com/ax6uuu)

---

## License

Private portfolio. © 2026 ax6uuu. All rights reserved.
