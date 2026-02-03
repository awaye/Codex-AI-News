import "./globals.css";
import type { Metadata } from "next";
import { Space_Grotesk, Source_Serif_4 } from "next/font/google";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap"
});

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap"
});

export const metadata: Metadata = {
  title: "AI Signal Desk",
  description: "Curated AI news across Africa and the world."
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${spaceGrotesk.variable} ${sourceSerif.variable} bg-white font-sans`}>
        {children}
      </body>
    </html>
  );
}
