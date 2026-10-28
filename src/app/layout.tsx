import type { Metadata } from "next";
import Link from "next/link";
import { PublicationHeader } from "@/components/PublicationHeader";
import { SchoolNav } from "@/components/SchoolNav";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Carlsbad Varsity", template: "%s | Carlsbad Varsity" },
  description: "High school sports coverage for Carlsbad, California.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" data-scroll-behavior="smooth"><body><PublicationHeader /><SchoolNav />{children}<footer className="footer"><div className="page-shell footer-inner"><div><strong>Carlsbad Varsity</strong><p>Independent high school sports coverage for Carlsbad, California.</p></div><nav aria-label="Footer"><Link href="/about/">About Us</Link><a href="mailto:mwilhalme@gmail.com?subject=Carlsbad%20Varsity%20coverage%20request">Request Coverage</a><a href="mailto:mwilhalme@gmail.com?subject=Contact%20Carlsbad%20Varsity">Contact Us</a></nav></div></footer></body></html>;
}
