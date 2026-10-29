import Link from "next/link";
import { SchoolNav } from "@/components/SchoolNav";

export function PublicationHeader() {
  return (
    <header className="publication-header">
      <div className="header-inner publication-header-inner">
        <Link className="masthead" href="/" aria-label="Carlsbad Varsity home">
          <span>CV</span><i aria-hidden="true" /> VARSITY
        </Link>
        <SchoolNav />
      </div>
    </header>
  );
}
