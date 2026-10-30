import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about North County Varsity, an independent publication covering varsity sports across North County San Diego.",
};

const email = "mwilhalme@gmail.com";

export default function AboutPage() {
  return (
    <main>
      <header className="about-hero">
        <div className="page-shell about-hero-inner">
          <p className="kicker">About North County Varsity</p>
          <h1>Local sports.<br />Local stories.<br />North County.</h1>
          <p className="dek">Founded in 2026, North County Varsity is an independent sports publication dedicated to covering varsity athletics across North County San Diego.</p>
        </div>
      </header>

      <div className="page-shell about-layout">
        <article className="about-copy">
          <section aria-labelledby="mission-heading">
            <p className="kicker">Our mission</p>
            <h2 id="mission-heading">Shining a spotlight on local student-athletes</h2>
            <p>Our mission is simple: to shine a spotlight on local student-athletes, celebrate their accomplishments, and make it easier for the community to follow the teams and sports that matter to them.</p>
            <p>North County Varsity brings together schedules, scores, news and original reporting in one convenient place. We also highlight relevant coverage from other publications, connecting readers with more stories about their local teams.</p>
            <p>We are beginning in Carlsbad and will expand thoughtfully across North County, recognizing the hard work, dedication and achievements of student-athletes in every community we cover.</p>
          </section>

          <section aria-labelledby="founder-heading">
            <h2 id="founder-heading">About the Founder</h2>
            <p>Founded in 2026 by journalist and Carlsbad resident Matt Wilhalme, North County Varsity grew out of a personal connection to the local school community and a desire to give student-athletes more opportunities to have their accomplishments recognized.</p>
            <p>Matt is a journalist and digital media professional with more than 15 years of experience, including roles at the Los Angeles Times, The Arizona Republic and NFL Media. His background includes prep sports coverage, digital storytelling, audience development and building digital products that help readers discover and engage with news.</p>
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
            <a className="primary-action" href={`mailto:${email}?subject=North%20County%20Varsity%20coverage%20request`}>Request Coverage</a>
            <a href={`mailto:${email}?subject=Contact%20North%20County%20Varsity`}>Contact Us</a>
          </div>
        </aside>
      </div>
    </main>
  );
}
