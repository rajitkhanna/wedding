import type { Metadata } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import "./globals.css";
import { ClientLayout } from "@/components/ClientLayout";

const cormorant = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
});

const jost = Jost({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://meghanarajit.com"),
  title: "Meghana & Rajit",
  description: "Join us to celebrate our wedding — November 28, 2026 · Boston",
  openGraph: {
    title: "Meghana & Rajit",
    description: "Join us to celebrate our wedding — November 28, 2026 · Boston",
    images: [{ url: "/og-image.jpg", width: 1200, height: 800 }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${cormorant.variable} ${jost.variable} antialiased`}
        style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
      >
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
