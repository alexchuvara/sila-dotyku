import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Siła dotyku: masaż, który zmienia samopoczucie",
  description: "Masaż ajurwedyjski i wschodni w Gliwicach. Strona w przygotowaniu.",
  // Keep search engines away until the site is ready to launch.
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pl" className="h-full antialiased">
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
