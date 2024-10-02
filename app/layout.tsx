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
        {children}
        <div className='toolbar'>
          <div style={{ padding: '0 20px' }}>
            <Path></Path>
          </div>
          <div style={{ padding: '0 20px' }}>
            <Icon name='github.svg' alt='github' href='https://github.com/n3cubed' width={30} />
          </div>
        </div>
      </body>
    </html>
  );
}
