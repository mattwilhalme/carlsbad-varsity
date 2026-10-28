import type { RelatedCoverage } from "@/domain/models";

export function MoreCoverage({ entries }: { entries?: RelatedCoverage[] }) {
  const approved = entries?.filter((entry) => entry.approvalStatus === "approved") ?? [];
  if (!approved.length) return null;

  return (
    <section className="game-section section-rule" aria-labelledby="coverage-heading">
      <p className="kicker">External reporting</p>
      <h2 id="coverage-heading">More Coverage</h2>
      <div className="coverage-list">
        {approved.map((entry) => (
          <a className="coverage-card" href={entry.url} target="_blank" rel="noreferrer" key={entry.id}>
            <span>{entry.publisher}{entry.publishedAt ? ` · ${new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" }).format(new Date(`${entry.publishedAt}T00:00:00Z`))}` : ""}</span>
            <strong>{entry.headline}</strong>
            <small>Read at {entry.publisher} ↗</small>
          </a>
        ))}
      </div>
    </section>
  );
}
