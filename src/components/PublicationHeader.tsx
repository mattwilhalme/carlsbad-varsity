import Link from "next/link";

export function PublicationHeader() {
  return (
    <header className="publication-header">
      <div className="header-inner publication-header-inner">
        <Link className="masthead" href="/" aria-label="North County Varsity home">
          <span>NC</span><i aria-hidden="true" /> VARSITY
        </Link>
        <nav className="publication-nav" aria-label="Publication">
          <Link href="/">Varsity</Link>
          <Link href="/about/">About Us</Link>
        </nav>
      </div>
    </header>
  );
}
