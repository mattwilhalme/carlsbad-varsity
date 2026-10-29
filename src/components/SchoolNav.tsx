import Link from "next/link";
import { schools } from "@/data/site-data";
import type { SchoolSlug } from "@/domain/models";

export function SchoolNav({ active }: { active?: SchoolSlug }) {
  return (
    <nav className="school-nav" aria-label="Schools">
      <div className="nav-inner">
        <Link href="/">Varsity</Link>
        {Object.values(schools).map((school) => (
          <Link key={school.slug} href={`/schools/${school.slug}/`} aria-current={active === school.slug ? "page" : undefined}>
            {school.shortName}
          </Link>
        ))}
        <Link href="/about/">About Us</Link>
      </div>
    </nav>
  );
}
