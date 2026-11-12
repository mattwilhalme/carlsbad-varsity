import { Suspense } from "react";

import { PreviewClient } from "./PreviewClient";

export default function PreviewPage() {
  return <Suspense fallback={<main className="preview-state"><p>Loading authorized preview…</p></main>}>
    <PreviewClient />
  </Suspense>;
}
