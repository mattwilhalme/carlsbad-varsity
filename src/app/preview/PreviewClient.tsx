"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { ArticlePresentation } from "@/components/ArticlePresentation";
import type { PublicArticleV1 } from "@/data/article-contract";
import { publicArticleToStory } from "@/data/public-article-mapper";
import type { EditorialStory } from "@/domain/models";

const PREVIEW_VERSION = "north-county-varsity.article-preview.v1";

export function PreviewClient() {
  const searchParams = useSearchParams();
  const slug = searchParams.get("slug");
  const token = searchParams.get("token");
  const [story, setStory] = useState<EditorialStory | null>(null);
  const [state, setState] = useState<"loading" | "ready" | "unavailable">("loading");

  useEffect(() => {
    if (!slug || !token) return;

    const controller = new AbortController();
    const cmsOrigin = (process.env.NEXT_PUBLIC_CMS_URL || "http://localhost:3000").replace(/\/$/, "");
    const endpoint = new URL("/api/public-content/v1/article-preview", cmsOrigin);
    endpoint.searchParams.set("slug", slug);

    fetch(endpoint, {
      headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
      signal: controller.signal,
    })
      .then(async (response) => {
        if (!response.ok) throw new Error("Preview unavailable");
        return response.json() as Promise<{ version: string; article: PublicArticleV1 }>;
      })
      .then((result) => {
        if (result.version !== PREVIEW_VERSION || !result.article) throw new Error("Unsupported preview response");
        setStory(publicArticleToStory(result.article));
        setState("ready");
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setState("unavailable");
      });

    return () => controller.abort();
  }, [slug, token]);

  if (!slug || !token || state === "unavailable") return <main className="preview-state"><h1>Preview unavailable</h1><p>Return to Payload and open a new preview link.</p></main>;
  if (state === "loading" || !story) return <main className="preview-state"><p>Loading authorized preview…</p></main>;
  return <ArticlePresentation preview story={story} />;
}
