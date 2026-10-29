import Link from "next/link";
export default function NotFound() { return <main className="page-shell not-found"><p className="kicker">404</p><h1>That page is out of bounds.</h1><p>We couldn’t find the city, school or team you requested.</p><Link href="/">Return to North County Varsity</Link></main>; }
