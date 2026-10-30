import type { Metadata } from "next";
import Link from "next/link";
import { PublicationHeader } from "@/components/PublicationHeader";
import { SchoolNav } from "@/components/SchoolNav";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://mattwilhalme.github.io/carlsbad-varsity/"),
  title: { default: "North County Varsity", template: "%s | North County Varsity" },
  description: "Varsity sports schedules, scores and coverage for North County San Diego.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" data-scroll-behavior="smooth"><body><PublicationHeader /><SchoolNav placement="global" />{children}<footer className="footer"><div className="page-shell footer-inner"><div><strong>North County Varsity</strong><p>Independent varsity sports coverage for North County San Diego.</p></div><nav aria-label="Footer"><Link href="/about/">About Us</Link><a href="mailto:mwilhalme@gmail.com?subject=North%20County%20Varsity%20coverage%20request">Request Coverage</a><a href="mailto:mwilhalme@gmail.com?subject=Contact%20North%20County%20Varsity">Contact Us</a></nav></div></footer></body></html>;
}
