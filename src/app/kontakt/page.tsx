import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kontakt",
  description: "Skontaktuj się z Wiktorią: zadzwoń lub zarezerwuj masaż ajurwedyjski w Gliwicach.",
};



export default function Contact() {
    return (
        <h1><p><a href="+48794786705" type="tel">794 786 705</a></p>Kontakt</h1>
    )

}