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
