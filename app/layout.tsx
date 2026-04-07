import type { Metadata } from "next";
import { Red_Hat_Display } from "next/font/google";
import "./globals.css";

const redHat = Red_Hat_Display({ subsets: ["latin"], weight: ["400","500","600","700","800","900"] });

export const metadata: Metadata = {
  title: "Maken Media — Claire Dashboard",
  description: "Content operations dashboard for Claire Arlandis",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${redHat.className} min-h-screen`}>
        {children}
      </body>
    </html>
  );
}
