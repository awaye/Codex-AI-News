import "./globals.css";
import type { Metadata } from "next";

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
      <body className="bg-white font-sans">
        {children}
      </body>
    </html>
  );
}
