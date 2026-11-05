import type { Metadata } from "next";
import { CoverageRequestForm } from "@/components/CoverageRequestForm";

export const metadata: Metadata = {
  title: "Request Coverage",
  description: "Request North County Varsity coverage of a local varsity sports event or story.",
};

const email = "editor@northcountyvarsity.com";

export default function RequestCoveragePage() {
  return (
    <main>
      <header className="request-coverage-hero">
        <div className="page-shell request-coverage-hero-inner">
          <p className="kicker">North County Varsity</p>
          <h1>Request Coverage</h1>
          <p className="dek">Tell us about a game, event, athlete or local sports story our editorial team should know about.</p>
        </div>
      </header>

      <div className="page-shell request-coverage-layout">
        <section aria-labelledby="coverage-form-heading">
          <h2 id="coverage-form-heading">Share the details</h2>
          <p>Nothing is required right now—send whatever information you have. Including a way to reach you will help us follow up.</p>
          <CoverageRequestForm />
        </section>

        <aside className="coverage-expectations">
          <p className="kicker">What happens next</p>
          <h2>We’ll review your request</h2>
          <p>Submitting this form does not guarantee coverage. Our editorial team considers timing, news value and reporter availability.</p>
          <p className="prefer-email">Prefer email? <a href={`mailto:${email}?subject=North%20County%20Varsity%20coverage%20request`}>Send us a message</a>.</p>
        </aside>
      </div>
    </main>
  );
}
