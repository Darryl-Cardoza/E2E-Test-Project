import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = { title: "Northstar — Your workspace", description: "A clear view of your work, all in one place." };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
