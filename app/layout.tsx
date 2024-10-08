import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../styles/globals.css";
import Path from '@/components/Path/Path'
import Icon from '@/components/Icon/Icon'

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "nitbit",
  description: "nitbit",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* <script data-domain="nitbit.dev" src="/stats/script.js  " data-api="/api/stats"></script> */}
          {children}
      </body>
    </html>
  );
}
