import { Quicksand, Inter } from "next/font/google";

export const quicksand = Quicksand({
  subsets: ["latin"],
  variable: "--font-quicksand",
});

export const fredoka = Inter({
  subsets: ["latin"],
  variable: "--font-fredoka",
  weight: ["400", "500", "600", "700"],
});
