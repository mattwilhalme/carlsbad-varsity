import Link from "next/link";

export function PublicationHeader() {
  return (
    <header className="publication-header">
      <div className="header-inner">
        <Link className="masthead" href="/">Carlsbad Varsity</Link>
        <p>High school sports from Carlsbad, California</p>
      </div>
    </header>
  );
}
