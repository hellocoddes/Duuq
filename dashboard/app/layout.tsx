import type { Metadata } from "next";
import "./globals.css";
import { Inter } from 'next/font/google'
import {Home} from "./page.tsx"


const inter = Inter({ subsets: ['latin'] })


export const metadata: Metadata = {
  title: "Kiwq",
  description: "A safety App for you family.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} flex flex-col bg-gradient-to-r min-h-screen`}>
        {children}
      </body>
    </html >
  );
}
