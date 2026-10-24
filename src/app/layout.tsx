import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import "./globals.css";

// latin-ext covers Polish letters; cyrillic is ready for Ukrainian and Russian.
const subsets: ("latin" | "latin-ext" | "cyrillic")[] = ["latin", "latin-ext", "cyrillic"];

const display = Cormorant_Garamond({
  subsets,
  weight: ["500", "600"],
  variable: "--font-cormorant",
  display: "swap",
});

const sans = Manrope({
  subsets,
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Siła dotyku: masaż, który zmienia samopoczucie",
  description: "Masaż ajurwedyjski i wschodni w Gliwicach. Strona w przygotowaniu.",
  // Keep search engines away until the site is ready to launch.
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pl" className={`${display.variable} ${sans.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans">{children}</body>
    </html>
  );
}
