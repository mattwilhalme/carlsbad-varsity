import type { PublicArticleV1 } from "@/data/article-contract";
import type { EditorialStory } from "@/domain/models";

const editorialImage = `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/images/editorial/north-county-field.jpg`;

export function publicArticleToStory(article: PublicArticleV1): EditorialStory {
  return {
    id: `cms:${article.id}`,
    slug: article.slug,
    sport: article.relationships.sports.map((sport) => sport.name).join(", ") || "North County Varsity",
    headline: article.headline,
    dek: article.summary,
    byline: article.authors.map((author) => author.name).join(" and ") || "North County Varsity staff",
    publishedAt: article.publishedAt || article.updatedAt,
    image: article.leadImage
      ? {
          src: article.leadImage.url,
          alt: article.leadImage.alt,
          credit: article.leadImage.credit || article.leadImage.caption || "",
          caption: article.leadImage.caption,
          width: article.leadImage.width,
          height: article.leadImage.height,
        }
      : { src: editorialImage, alt: "A North County athletics field.", credit: "" },
    relatedLinks: article.relationships.schools.map((school) => ({
      label: `More ${school.name} coverage`,
      href: `/carlsbad/${school.slug}/`,
    })),
    body: article.body,
  };
}
