import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Maken Media — Claire Dashboard",
  description: "Content operations dashboard for Claire Arlandis",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        {children}
      </body>
    </html>
  );
}
