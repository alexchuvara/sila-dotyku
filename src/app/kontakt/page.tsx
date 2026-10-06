import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kontakt",
  description: "Skontaktuj się z Wiktorią: zadzwoń lub zarezerwuj masaż ajurwedyjski w Gliwicach.",
};

export default function Contact() {
  return (
    <main>
      <h1>Kontakt</h1>
      <p>
        <a href="tel:+48794786705">794 786 705</a>
      </p>
    </main>
  );
}
