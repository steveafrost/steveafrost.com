export interface Project {
  readonly slug: string;
  readonly name: string;
  readonly description: string;
  readonly language: string;
  readonly tech: readonly string[];
  readonly github?: string;
  readonly mockUrl: string;
  readonly role: string;
}

export const projects: readonly Project[] = [
  {
    slug: 'leon-bridges',
    name: 'Leon Bridges',
    description: 'Official artist website for Grammy-winning R&B/soul artist Leon Bridges. Split-panel layout with full-viewport hero, discography, tour dates via Seated widget, and merch integration.',
    language: 'HTML',
    tech: ['HTML', 'CSS', 'jQuery'],
    mockUrl: '/projects/mock/leon-bridges',
    role: 'Lead Developer',
  },
  {
    slug: 'caamp',
    name: 'CAAMP',
    description: 'Band portfolio and tour site for indie folk group CAAMP. Minimalist design with tour date management, album showcases, and merch store.',
    language: 'Next.js',
    tech: ['Next.js', 'Headless CMS', 'E-commerce'],
    mockUrl: '/projects/mock/caamp',
    role: 'Lead Developer',
  },
  {
    slug: 'sesame-street-live',
    name: 'Sesame Street Live',
    description: 'Tour website for Sesame Street Live theatrical show. Vibrant animated hero, show date listings, newsletter signup, and FAQ.',
    language: 'Next.js',
    tech: ['Next.js', 'Tailwind CSS', 'Headless CMS', 'Vercel'],
    github: 'https://github.com/round-room-live/sesame-street-live',
    mockUrl: '/projects/mock/sesame-street-live',
    role: 'Lead Developer',
  },
  {
    slug: 'drew-aichele',
    name: 'Drew Aichele',
    description: 'Portfolio website for NYC food stylist Drew Aichele. Dark sidebar navigation with masonry photo grid showcasing editorial and commercial food styling work.',
    language: 'TypeScript',
    tech: ['Next.js', 'Tailwind CSS', 'Masonry Grid', 'Vercel'],
    mockUrl: '/projects/mock/drew-aichele',
    role: 'Solo Developer',
  },
  {
    slug: 'cocomelon',
    name: 'Cocomelon On Tour',
    description: 'Official tour website for the Cocomelon Live theatrical show. Dynamic show listings with geolocation-based nearby shows, newsletter signup with age gate, and CMS-driven content.',
    language: 'Next.js',
    tech: ['Next.js', 'Tailwind CSS', 'Headless CMS', 'Vercel'],
    github: 'https://github.com/round-room-live/coco-melon-on-tour',
    mockUrl: '/projects/mock/cocomelon',
    role: 'Lead Developer',
  },
  {
    slug: 'tip-track',
    name: 'Tip Track',
    description: 'Next.js PWA for Shipt delivery drivers to track orders, record tips by address, and view earning reports with interactive charts.',
    language: 'TypeScript',
    tech: ['Next.js', 'Tailwind CSS', 'Prisma', 'Clerk Auth', 'PWA'],
    github: 'https://github.com/steveafrost/tip-track',
    mockUrl: '/projects/mock/tip-track',
    role: 'Solo Developer',
  },
  {
    slug: 'phillips-nyc',
    name: 'Phillips NYC',
    description: 'Custom Shopify theme for a NYC-based fashion retailer. Bespoke design with product collections, announcement bars, and optimized checkout.',
    language: 'Shopify',
    tech: ['Shopify', 'Liquid', 'CSS', 'JavaScript'],
    mockUrl: '/projects/mock/phillips-nyc',
    role: 'Theme Developer',
  },
  {
    slug: 'message-relay',
    name: 'Message Relay',
    description: 'Node.js webhook server that bridges HTTP POST requests to iMessage via macOS AppleScript. Supports group messaging, health monitoring, and launchd auto-start.',
    language: 'JavaScript',
    tech: ['Node.js', 'Express', 'AppleScript', 'launchd'],
    github: 'https://github.com/steveafrost/message-relay',
    mockUrl: '/projects/mock/message-relay',
    role: 'Solo Developer',
  },
  {
    slug: 'the-ride-bus-schedule',
    name: 'TheRide Bus Schedule',
    description: 'TRMNL e-ink display recipe showing real-time bus departures for TheRide. Built with Liquid templating and the TRMNL API.',
    language: 'Liquid',
    tech: ['Liquid', 'TRMNL', 'API Integration'],
    github: 'https://github.com/steveafrost/the-ride-bus-schedule-trmnl',
    mockUrl: '/projects/mock/the-ride-bus-schedule',
    role: 'Solo Developer',
  },
  {
    slug: 'parcel-tracker',
    name: 'Parcel Tracker',
    description: 'Self-hosted package tracking service that automatically reads shipping emails from iCloud Mail and submits tracking numbers to Parcel app.',
    language: 'TypeScript',
    tech: ['TypeScript', 'Express', 'SQLite', 'IMAP', 'Docker'],
    github: 'https://github.com/steveafrost/parcel-tracker',
    mockUrl: '/projects/mock/parcel-tracker',
    role: 'Solo Developer',
  },
  {
    slug: 'plex-watchdog',
    name: 'Plex Watchdog',
    description: 'Automatic crash recovery for Plex Media Server on macOS. Monitors every 60 seconds, detects crashes, and auto-restarts Plex with logging.',
    language: 'Shell',
    tech: ['Shell', 'LaunchAgent', 'macOS'],
    github: 'https://github.com/steveafrost/plex-watchdog-macos',
    mockUrl: '/projects/mock/plex-watchdog',
    role: 'Solo Developer',
  },
] as const;
