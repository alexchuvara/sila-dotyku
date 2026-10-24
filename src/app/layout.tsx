import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import { themeInitScript } from "@/lib/theme";
import "./globals.css";

// next/font reads these options at build time, so they must be literals (no shared variables).
// latin-ext covers Polish letters; cyrillic is ready for Ukrainian and Russian.

const display = Cormorant_Garamond({
  subsets: ["latin", "latin-ext", "cyrillic"],
  weight: ["500", "600"],
  variable: "--font-cormorant",
  display: "swap",
});

const sans = Manrope({
  subsets: ["latin", "latin-ext", "cyrillic"],
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
    // suppressHydrationWarning: the inline script sets data-theme before React hydrates (ADR-0011).
    <html
      lang="pl"
      className={`${display.variable} ${sans.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="flex min-h-full flex-col font-sans">{children}</body>
    </html>
  );
}
