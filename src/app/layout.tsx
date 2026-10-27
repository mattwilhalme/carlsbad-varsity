import type { Metadata } from "next";
import { PublicationHeader } from "@/components/PublicationHeader";
import { SchoolNav } from "@/components/SchoolNav";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Carlsbad Varsity", template: "%s | Carlsbad Varsity" },
  description: "High school sports coverage for Carlsbad, California.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><PublicationHeader /><SchoolNav />{children}<footer className="footer"><div className="page-shell"><strong>Carlsbad Varsity</strong><p>A future sports section of Carlsbad Independent.</p></div></footer></body></html>;
}
