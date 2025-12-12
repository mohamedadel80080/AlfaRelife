import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Healthcare Staffing Platform - Pharmacy Shifts",
  description: "Professional healthcare staffing and shift management platform. Find and manage pharmacy shifts with ease.",
  keywords: ["healthcare", "pharmacy", "shifts", "staffing", "medical", "professionals"],
  authors: [{ name: "Healthcare Staffing" }],
  icons: {
    icon: [
      { url: "/logo.svg", type: "image/svg+xml" },
      { url: "/icons/ios/32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/ios/64.png", sizes: "64x64", type: "image/png" },
    ],
    apple: [
      { url: "/icons/ios/180.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/manifest.json",
  themeColor: "#004248",
  openGraph: {
    title: "Healthcare Staffing Platform",
    description: "Professional pharmacy shift management",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Healthcare Staffing Platform",
    description: "Professional pharmacy shift management",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "HealthStaff",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
