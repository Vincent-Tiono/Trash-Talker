import type React from "react";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { fredoka, quicksand } from "./fonts";

export const metadata = {
  title: "TrashTalker - The Sassy Recycling App",
  description: "Gamified recycling app that helps you classify waste correctly",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${fredoka.variable} ${quicksand.variable}`}
    >
      <body className="font-quicksand" suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
