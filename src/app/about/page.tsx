import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about North County Varsity, an independent publication covering varsity sports across North County San Diego.",
};

const email = "editor@northcountyvarsity.com";

export default function AboutPage() {
  return (
    <main>
      <header className="about-hero">
        <div className="page-shell about-hero-inner">
          <p className="kicker">About North County Varsity</p>
          <p className="dek">Founded in 2026, North County Varsity is an independent sports publication dedicated to covering varsity athletics across North County San Diego.</p>
        </div>
      </header>

      <div className="page-shell about-layout">
        <article className="about-copy">
          <section aria-labelledby="mission-heading">
            <p className="kicker">Our mission</p>
            <h2 id="mission-heading">More local coverage</h2>
            <p>Our goal is to provide professional coverage of high school sports in northern San Diego County.</p>
            <p>North County Varsity provides schedules, scores and original reporting in one convenient place. We also highlight relevant coverage from other publications covering North County schools and athletes to connect readers with more stories about their local teams.</p>
            <p>Starting primarily in Carlsbad, we intend to sell advertising sponsorships to underwrite freelance reporters and photographers.</p>
          </section>

          <section aria-labelledby="founder-heading">
            <h2 id="founder-heading">About the Founder</h2>
            <p>Founded in 2026 by Matt Wilhalme, North County Varsity grew out of a personal connection to the local school community and a desire to give student-athletes more opportunities to have their accomplishments recognized.</p>
            <p>Matt is a digital media professional with more than 15 years of experience, including roles at the Los Angeles Times, The Arizona Republic and NFL Media. His background includes prep sports coverage, digital storytelling, audience development and building digital products that help readers discover and engage with news.</p>
          </section>

          <section aria-labelledby="independence-heading">
            <h2 id="independence-heading">Editorial Independence</h2>
            <p>North County Varsity is independently operated and is not affiliated with or endorsed by any school, school district or athletic governing organization.</p>
            <p>We are committed to fair, accurate coverage of local schools and their athletic programs. Personal connections, advertising relationships and business sponsorships do not determine editorial coverage.</p>
            <p>We welcome corrections and encourage readers to share information that helps us provide accurate schedules, scores and reporting.</p>
          </section>
        </article>

        <aside className="about-contact" aria-labelledby="contact-heading">
          <p className="kicker">Get in touch</p>
          <h2 id="contact-heading">Have a story worth sharing?</h2>
          <p>We welcome news tips, coverage requests, corrections and suggestions from athletes, families, coaches and community members.</p>
          <div className="about-actions">
            <Link className="primary-action" href="/request-coverage/">Request Coverage</Link>
            <a href={`mailto:${email}?subject=Contact%20North%20County%20Varsity`}>Contact Us</a>
          </div>
          <p className="prefer-email">Prefer email? <a href={`mailto:${email}?subject=North%20County%20Varsity%20coverage%20request`}>Send us a message</a>.</p>
        </aside>
      </div>
    </main>
  );
}
