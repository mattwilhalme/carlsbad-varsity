import type { EditorialStory } from "@/domain/models";

const editorialImage = `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/images/editorial/north-county-field.jpg`;

export const editorialStories: EditorialStory[] = [
  {
    slug: "basketball-article-test-homepage-build-2026",
    sport: "Boys’ basketball",
    headline: "Basketball — Article test for homepage build 2026",
    dek: "Carlsbad turns a composed second half into a statement win, offering an early look at how the Lancers hope to play when the season arrives.",
    byline: "North County Varsity staff",
    publishedAt: "2026-10-28",
    image: { src: editorialImage, alt: "A sunny North County community ballfield beneath a clear blue sky.", credit: "Photo courtesy of Matt Wilhalme" },
    relatedLinks: [
      { label: "Carlsbad boys’ basketball team page", href: "/carlsbad/carlsbad/boys-basketball/" },
      { label: "Carlsbad girls’ basketball team page", href: "/carlsbad/carlsbad/girls-basketball/" },
    ],
    body: [
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer vitae orci at sapien malesuada malesuada. Carlsbad settled into its half-court defense, shared the ball and found the open player when the possession mattered most.",
      "Praesent commodo, sapien at luctus tincidunt, augue justo sodales arcu, vitae faucibus neque sem at erat. The Lancers’ pace changed after halftime, with the guards applying pressure and the frontcourt finishing through contact.",
      "Sed posuere consectetur est at lobortis. Maecenas faucibus mollis interdum. For a program still shaping its identity, the final minutes supplied the most useful lesson: value every trip, defend without fouling and trust the next pass.",
    ],
    boxScore: { periods: ["1", "2", "3", "4"], teams: [{ name: "Carlsbad", scores: [16, 12, 20, 18], total: 66 }, { name: "Oceanside", scores: [13, 18, 12, 15], total: 58 }] },
    standings: [{ team: "Carlsbad", league: "1–0", overall: "1–0" }, { team: "Oceanside", league: "1–0", overall: "1–0" }, { team: "La Costa Canyon", league: "1–0", overall: "1–0" }, { team: "Vista", league: "1–0", overall: "1–0" }],
  },
  {
    slug: "football-article-test-homepage-build-2026",
    sport: "Football",
    headline: "Football — Article test for homepage build 2026",
    dek: "Under the lights, Carlsbad’s offense finds its rhythm while a disciplined defense closes the door late.",
    byline: "North County Varsity staff",
    publishedAt: "2026-10-27",
    image: { src: editorialImage, alt: "A sunny North County community ballfield beneath a clear blue sky.", credit: "Photo courtesy of Matt Wilhalme" },
    relatedLinks: [{ label: "Explore Carlsbad High School coverage", href: "/carlsbad/carlsbad/" }, { label: "More North County scores", href: "/#recent-results" }],
    body: [
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla vitae elit libero, a pharetra augue. Carlsbad’s opening drive established the evening’s tone with patient runs and a timely throw outside the numbers.",
      "Cras mattis consectetur purus sit amet fermentum. Donec ullamcorper nulla non metus auctor fringilla. The defense answered after the break, forcing consecutive short possessions and giving the offense favorable field position.",
      "Aenean lacinia bibendum nulla sed consectetur. Etiam porta sem malesuada magna mollis euismod. When the final whistle arrived, the Lancers had produced the kind of balanced performance that travels well.",
    ],
    boxScore: { periods: ["1", "2", "3", "4"], teams: [{ name: "Carlsbad", scores: [7, 10, 7, 7], total: 31 }, { name: "Vista", scores: [3, 7, 0, 7], total: 17 }] },
    standings: [{ team: "Carlsbad", league: "1–0", overall: "1–0" }, { team: "El Camino", league: "1–0", overall: "1–0" }, { team: "Oceanside", league: "1–0", overall: "1–0" }, { team: "Vista", league: "1–0", overall: "1–0" }],
  },
  {
    slug: "track-field-article-test-homepage-build-2026",
    sport: "Track and field",
    headline: "Track and field — Article test for homepage build 2026",
    dek: "Carlsbad’s sprinters set the early pace in a bright afternoon meet built around depth, clean exchanges and personal bests.",
    byline: "North County Varsity staff",
    publishedAt: "2026-10-26",
    image: { src: editorialImage, alt: "A sunny North County community ballfield beneath a clear blue sky.", credit: "Photo courtesy of Matt Wilhalme" },
    relatedLinks: [{ label: "Explore Carlsbad High School coverage", href: "/carlsbad/carlsbad/" }, { label: "Find upcoming Carlsbad games", href: "/#upcoming-games" }],
    body: [
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi leo risus, porta ac consectetur ac, vestibulum at eros. The Lancers opened the meet with sharp starts and carried that confidence through the relay exchanges.",
      "Vestibulum id ligula porta felis euismod semper. Integer posuere erat a ante venenatis dapibus posuere velit aliquet. Coaches pointed to the team’s depth as the most encouraging result of the afternoon.",
      "Donec sed odio dui. Curabitur blandit tempus porttitor. Personal bests arrived across the sprint group, but the clean baton work provided the detail the athletes were most eager to carry forward.",
    ],
    boxScore: { periods: ["Sprints", "Distance", "Field", "Relays"], teams: [{ name: "Carlsbad", scores: [31, 22, 24, 18], total: 95 }, { name: "San Dieguito", scores: [24, 27, 18, 14], total: 83 }] },
    standings: [{ team: "Carlsbad", league: "1–0", overall: "1–0" }, { team: "San Dieguito", league: "1–0", overall: "1–0" }, { team: "Torrey Pines", league: "1–0", overall: "1–0" }, { team: "Canyon Crest", league: "1–0", overall: "1–0" }],
  },
];

export const leadStory = editorialStories[0];
export const secondaryStories = editorialStories.slice(1);
export function getEditorialStory(slug: string) { return editorialStories.find((story) => story.slug === slug); }
export function articlePath(story: EditorialStory) { return `/articles/${story.slug}/`; }
