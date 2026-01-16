import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ReduxProvider } from "@/store/ReduxProvider";
import SessionWrapper from "@/components/auth/SessionWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "New discussion | Rubberduck",
  description: "Rubberduck AI - Your AI-powered coding assistant",
  icons: {
    icon: "/rubberduck_logo.ico",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
  },

};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" >
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased text-primary`}
      >
        <SessionWrapper>
          <ReduxProvider>
            {children}
          </ReduxProvider>
        </SessionWrapper>
      </body>
    </html>
  );
}
