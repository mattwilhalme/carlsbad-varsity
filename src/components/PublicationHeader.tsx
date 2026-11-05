import Link from "next/link";

export function PublicationHeader() {
  return (
    <header className="publication-header">
      <div className="header-inner publication-header-inner">
        <Link className="masthead" href="/" aria-label="North County Varsity home">
          North County Varsity
        </Link>
        <nav className="publication-nav" aria-label="Publication">
          <Link className="coverage-nav-button" href="/request-coverage/">Request Coverage</Link>
          <Link href="/about/">About Us</Link>
        </nav>
      </div>
    </header>
  );
}
