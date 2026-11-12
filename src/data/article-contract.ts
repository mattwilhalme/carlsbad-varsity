export type PublicTextFormat = "bold" | "code" | "italic" | "strikethrough" | "underline";

export type PublicArticleInline =
  | { type: "text"; text: string; formats: PublicTextFormat[] }
  | { type: "link"; url: string; children: PublicArticleInline[] };

export type PublicArticleBlock =
  | { type: "paragraph"; children: PublicArticleInline[] }
  | { type: "heading"; level: 2 | 3 | 4; children: PublicArticleInline[] }
  | { type: "quote"; children: PublicArticleInline[] }
  | { type: "list"; style: "ordered" | "unordered"; items: PublicArticleInline[][] };

export interface PublicArticleV1 {
  id: string;
  slug: string;
  headline: string;
  summary: string;
  authors: { id: string; name: string; slug: string; title?: string }[];
  body: PublicArticleBlock[];
  leadImage: null | {
    id: string;
    url: string;
    alt: string;
    caption?: string;
    credit?: string;
    width?: number;
    height?: number;
  };
  publishedAt: string;
  updatedAt: string;
  relationships: {
    publication: { id: string; slug: string; name: string } | null;
    schools: { id: string; slug: string; name: string }[];
    sports: { id: string; slug: string; name: string }[];
    teams: { id: string; slug: string; name: string }[];
  };
}

export type PublicMediaV1 = PublicArticleV1["leadImage"];

export interface PublicArticlesSnapshotV1 {
  version: "north-county-varsity.articles.v1";
  generatedAt: string;
  articles: PublicArticleV1[];
}

export interface PublicHomepageSnapshotV1 {
  version: "north-county-varsity.homepage.v1";
  generatedAt: string;
  homepage: null | {
    id: string;
    title: string;
    publication: { id: string; slug: string; name: string } | null;
    updatedAt: string;
    stories: {
      articleId: string;
      slug: string;
      role: "lead" | "featured" | "standard";
      headline: string;
      summary: string;
      kicker: string;
      thumbnail: PublicMediaV1;
      readDowns: { id: string; slug: string; headline: string }[];
    }[];
  };
}

export interface PublicContentBundleV1 {
  articles: PublicArticlesSnapshotV1;
  homepage: PublicHomepageSnapshotV1;
}
