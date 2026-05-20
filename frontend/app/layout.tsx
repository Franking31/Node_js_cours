import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "QuizAI — Générateur de quiz intelligent",
  description: "Analyse ton cours et génère un quiz personnalisé avec l'IA",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;700;800&family=DM+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}