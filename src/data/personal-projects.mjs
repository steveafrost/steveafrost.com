/** Personal featurettes are curated separately from the existing work portfolio.
 * featuredDate is the dated portfolio write-up, not a claimed launch date or
 * repository push date. Adding a featurette never removes an older route.
 */
export const personalProjects = [
  {
    slug: 'kindle-newspaper', name: 'Kindle newspaper',
    subtitle: 'A nightly edition for my Kindle.',
    featuredDate: '2026-09-30',
    story: '/articles/building-a-nightly-newspaper-for-my-kindle',
    postcard: '/river-assets/kindle.png', postcardClass: 'kindle',
    hero: '/river-assets/kindle-project-scene.png',
    heroAlt: 'Steve’s Evening Edition newspaper resting on a book in warm sunlight.',
    noteTitle: 'Steve’s Evening Edition',
    paragraphs: [
      'A nightly newspaper needs a stopping point. RSS feeds keep producing articles, and putting all of them into an EPUB would just move the backlog onto a Kindle.',
      "In August, I built Steve's Evening Edition around a smaller target: ten to eighteen articles, with a reading budget of about 9,000 words. It collects stories from curated feeds, filters and ranks them, builds an EPUB, and hands it to a delivery service.",
    ],
    sources: ['/articles/building-a-nightly-newspaper-for-my-kindle'],
  },
  {
    slug: 'tiny-gifs', name: 'Tiny GIFs',
    subtitle: 'Good motion, smaller files.',
    featuredDate: '2026-08-18',
    story: '/articles/making-gifs-small-enough-for-a-conversation',
    repository: 'https://github.com/steveafrost/tiny-gifs',
    postcard: '/river-assets/gif.png', postcardClass: 'gif',
    hero: '/personal-projects/tiny-gifs-scene.png',
    heroAlt: 'A paper filmstrip showing the running Tiny GIFs beagle in warm sunlight.',
    noteTitle: 'A smaller reaction',
    paragraphs: [
      'Tiny GIFs puts a searchable reaction drawer inside Messages, with a SwiftUI containing app and an optional keyboard for supported chat apps. The work started with a practical problem: a GIF that looked small in the picker could still take over the conversation.',
      'The renderer normalizes outgoing animation to a 192-by-192 canvas with a 500 KB limit. A tap renders and sends the sticker; the drawer closes after the send succeeds. The optional keyboard uses the pasteboard, so the receiving app still controls how a GIF appears.',
    ],
    sources: ['/articles/making-gifs-small-enough-for-a-conversation', 'https://github.com/steveafrost/tiny-gifs'],
  },
  {
    slug: 'parcelrouter', name: 'ParcelRouter',
    subtitle: 'Shipping emails to package events.',
    featuredDate: '2026-05-21',
    story: '/articles/parcelrouter-from-inbox-script-to-package-event-router',
    repository: 'https://github.com/steveafrost/parcelrouter',
    postcard: '/river-assets/parcel.png', postcardClass: 'parcel',
    hero: '/personal-projects/parcelrouter-scene.png',
    heroAlt: 'Kraft parcels and printed postal artwork resting on warm cream paper.',
    noteTitle: 'An inbox with somewhere to go',
    paragraphs: [
      'ParcelRouter reads shipping emails from iCloud Mail, extracts tracking numbers, and stores package records locally. A TypeScript service, SQLite database, and local dashboard turn those messages into something easier to review and search.',
      'Uncertain detections wait in a review queue before becoming deliveries. Parcel sync and webhook events are optional outputs, so the local dashboard remains useful without enabling another integration.',
      'Package creation and review events describe what the service knows from its inbox. They do not establish that a box has arrived on the doorstep.',
    ],
    sources: ['/articles/parcelrouter-from-inbox-script-to-package-event-router', 'https://github.com/steveafrost/parcelrouter'],
  },
  {
    slug: 'pi-skill-recommender', name: 'Pi Skill Recommender',
    subtitle: 'Repeated work, ready for review.', featuredDate: '2026-06-20',
    story: '/articles/turning-repeated-agent-workflows-into-skills-worth-keeping',
    repository: 'https://github.com/steveafrost/pi-skill-recommender',
    postcard: '/river-assets/river-full-bleed.png', postcardClass: 'skill',
    postcardText: '/skill-recommender-candidates',
    hero: '/river-assets/river-full-bleed.png', heroAlt: 'The illustrated river landscape from Steve’s portfolio.',
    screen: true, sourceExcerpt: '/skill-recommender-candidates\n/skill-recommender-generate <candidate-id>\n/skill-recommender-promote <candidate-id>',
    sourceLabel: 'Commands documented in the project README',
    noteTitle: 'Repetition is a starting point',
    paragraphs: [
      'I built Pi Skill Recommender to collect recurring work across coding sessions. It keeps lightweight observations locally, groups similar workflows, and gives me a list of candidates to review.',
      'A candidate needs observations from more than one session before it qualifies for a draft. Generation takes an explicit command. I can ignore a suggestion, snooze it, or generate a template-based SKILL.md and edit it before keeping it.',
      'Repeated work can still be a repeated mistake. The matching rule points to a pattern; it cannot decide whether the steps are useful. Generated drafts also sit beneath Pi’s default skill root, so they need review before a reload makes them available.',
    ],
    sources: ['/articles/turning-repeated-agent-workflows-into-skills-worth-keeping', 'https://github.com/steveafrost/pi-skill-recommender'],
  },
  {
    slug: 'message-relay', name: 'Message Relay',
    subtitle: 'Webhook alerts in an existing conversation.', featuredDate: '2026-02-18',
    story: '/articles/how-my-cats-litter-box-learned-to-text',
    repository: 'https://github.com/steveafrost/message-relay',
    postcard: '/img/projects/message-relay.png', postcardClass: 'relay',
    hero: '/img/projects/message-relay.png', heroAlt: 'Existing portfolio mock replica of Message Relay’s command-line workflow.',
    screen: true, artworkCaption: 'Portfolio mock replica of the command-line workflow.', demo: '/projects/mock/message-relay',
    noteTitle: 'An alert where we already look',
    paragraphs: [
      'I wanted our Litter-Robot alerts in the family iMessage conversation. Message Relay accepts a webhook request and passes the message to the macOS Messages app through AppleScript.',
      'The Node.js service supports individual recipients and an existing group chat selected by keyword. launchd starts the service at login and restarts it if it exits, with logs and a health endpoint for checking what is running.',
      'It depends on a Mac with Messages configured and permission to automate the app. The webhook service is the bridge; Messages still handles sending the text.',
    ],
    sources: ['/articles/how-my-cats-litter-box-learned-to-text', 'https://github.com/steveafrost/message-relay'],
  },
  {
    slug: 'the-ride-bus-schedule', name: 'TheRide Bus Schedule',
    subtitle: 'The next bus, at a glance.', featuredDate: '2025-12-18',
    story: '/articles/building-a-bus-schedule-for-an-e-ink-display',
    repository: 'https://github.com/steveafrost/the-ride-bus-schedule-trmnl',
    postcard: '/img/projects/the-ride-bus-schedule.png', postcardClass: 'bus',
    hero: '/img/projects/the-ride-bus-schedule.png', heroAlt: 'Existing portfolio mock replica of TheRide departures on a TRMNL display.',
    screen: true, artworkCaption: 'Portfolio mock replica; departure times are illustrative.', demo: '/projects/mock/the-ride-bus-schedule',
    noteTitle: 'Three departures are enough',
    paragraphs: [
      'I wanted to check the next bus without pulling out my phone. This TRMNL recipe puts TheRide departure data on an e-ink display: route, direction, and time.',
      'The Liquid template limits the display to three departures and maps direction IDs to readable destinations. Large text and a last-updated time make the screen useful for a quick glance on the way out.',
      'The display refreshes on a schedule. It is a snapshot of the departure data at the last update, rather than a continuously changing timetable.',
    ],
    sources: ['/articles/building-a-bus-schedule-for-an-e-ink-display', 'https://github.com/steveafrost/the-ride-bus-schedule-trmnl'],
  },
  {
    slug: 'tip-track', name: 'Tip Track',
    subtitle: 'Orders and tips, easier to look up.', featuredDate: '2025-11-18',
    story: '/articles/turning-a-nextjs-app-into-a-pwa-for-delivery-drivers',
    repository: 'https://github.com/steveafrost/tip-track',
    postcard: '/img/projects/tip-track.png', postcardClass: 'tips',
    hero: '/img/projects/tip-track.png', heroAlt: 'Existing portfolio mock replica of Tip Track’s add-order screen.',
    screen: true, artworkCaption: 'Portfolio mock replica of the add-order screen.', demo: '/projects/mock/tip-track',
    noteTitle: 'A better record than map pins',
    paragraphs: [
      'My friend was tracking Shipt tips with emoji-labelled addresses in Apple Maps. I built Tip Track so he could log orders, record tips by address, and look through reports in one place.',
      'The Next.js app installs to a phone’s home screen as a PWA. The approach described in the write-up caches the app shell and tries the network first for data, with previously loaded data available when a connection drops.',
      'Offline data is a fallback, not a promise that new orders will sync in the background. The project keeps the delivery record useful without requiring an App Store download.',
    ],
    sources: ['/articles/turning-a-nextjs-app-into-a-pwa-for-delivery-drivers', 'https://github.com/steveafrost/tip-track'],
  },
];

export function personalProjectHref(project) { return `/projects/${project.slug}`; }

export function newestPersonalProjects(projects = personalProjects, count = 3) {
  return [...projects].sort((a, b) => {
    const dateOrder = b.featuredDate.localeCompare(a.featuredDate);
    return dateOrder || (a.slug < b.slug ? -1 : a.slug > b.slug ? 1 : 0);
  }).slice(0, count);
}

export function personalProjectSelection(currentSlug, projects = personalProjects) {
  return newestPersonalProjects(projects).map(project => ({
    name: project.name, href: personalProjectHref(project), current: project.slug === currentSlug,
  }));
}
