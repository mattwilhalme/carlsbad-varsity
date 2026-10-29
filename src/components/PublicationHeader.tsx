import Link from "next/link";

export function PublicationHeader() {
  return (
    <header className="publication-header">
      <div className="header-inner publication-header-inner">
        <Link className="masthead" href="/" aria-label="Carlsbad Varsity home">
          <span>CV</span><i aria-hidden="true" /> VARSITY
        </Link>
        <nav className="publication-nav" aria-label="Publication">
          <Link href="/">Varsity</Link>
          <Link href="/about/">About Us</Link>
        </nav>
      </div>
    </header>
  );
}
