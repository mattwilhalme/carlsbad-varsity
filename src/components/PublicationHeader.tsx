import Link from "next/link";

export function PublicationHeader() {
  return (
    <header className="publication-header">
      <div className="header-inner publication-header-inner">
        <Link className="masthead" href="/" aria-label="North County Varsity home">
          <span>North County</span><i aria-hidden="true" /> Varsity
        </Link>
        <nav className="publication-nav" aria-label="Publication">
          <Link href="/about/">About Us</Link>
        </nav>
      </div>
    </header>
  );
}
