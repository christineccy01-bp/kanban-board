import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Theme } from "@radix-ui/themes";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kanban Board App",
  description: "Kanban Board App created by Shen Fung and Christine",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full w-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full min-w-full flex">
        <ThemeProvider attribute="class">
          <Theme className="flex flex-1">{children}</Theme>
        </ThemeProvider>
      </body>
    </html>
  );
}
