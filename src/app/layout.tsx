import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BuildMap — Discover where Pune is being built",
  description: "A map-first way to explore residential, commercial and mixed-use developments across Pune.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
