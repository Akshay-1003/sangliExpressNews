import "jsvectormap/dist/jsvectormap.css";
import "flatpickr/dist/flatpickr.min.css";
import "@/css/satoshi.css";
import "@/css/style.css";
import { cn } from '../lib/utils';
import { Inter, Lexend } from "next/font/google";
import ClientLayout from "./clientSideLayout"; // Import client-side layout
import { Metadata } from 'next';
import { HelmetProvider } from 'react-helmet-async';

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const lexend = Lexend({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-lexend",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={cn(
        "min-h-full scroll-smooth bg-white antialiased",
        inter.variable,
        lexend.variable,
      )}
    >
      
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
