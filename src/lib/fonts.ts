import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";

// Self-hosted by next/font at build time: no runtime requests to Google.
export const instrumentSerif = Instrument_Serif({
  subsets: ["latin", "latin-ext"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
  display: "swap",
});

export const geist = Geist({
  subsets: ["latin", "latin-ext"],
  variable: "--font-geist", // variable font, weights 100-900 (300-700 used)
  display: "swap",
});

export const geistMono = Geist_Mono({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500"],
  variable: "--font-geist-mono",
  display: "swap",
});

export const fontVariables = `${instrumentSerif.variable} ${geist.variable} ${geistMono.variable}`;
