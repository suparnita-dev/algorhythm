import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: {
    default: "AlgoRhythm | Learn DSA by seeing it",
    template: "%s | AlgoRhythm",
  },
  description:
    "An interactive workspace for visualizing data structures, tracing algorithms, practicing with quizzes, and learning with an AI tutor.",
  applicationName: "AlgoRhythm",
  keywords: [
    "data structures",
    "algorithms",
    "DSA",
    "algorithm visualization",
    "coding interview preparation",
  ],
  authors: [{ name: "Suparnita Huduk" }],
  creator: "Suparnita Huduk",
  metadataBase: new URL("https://dsa-platform-ten.vercel.app"),
  openGraph: {
    type: "website",
    siteName: "AlgoRhythm",
    title: "AlgoRhythm | Learn DSA by seeing it",
    description:
      "Visualize algorithms, understand every step, and build confident problem-solving intuition.",
    url: "https://dsa-platform-ten.vercel.app",
  },
  twitter: {
    card: "summary",
    title: "AlgoRhythm | Learn DSA by seeing it",
    description:
      "Visualize algorithms, understand every step, and build confident problem-solving intuition.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
