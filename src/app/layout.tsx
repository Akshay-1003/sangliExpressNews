'use client';

import "jsvectormap/dist/jsvectormap.css";
import "flatpickr/dist/flatpickr.min.css";
import "@/css/satoshi.css";
import "@/css/style.css";
import { cn } from '../lib/utils';
import React, { useEffect, useState } from "react";
import Loader from "@/components/common/Loader";
import AuthProvider from "@/provider/AuthProvider";
import ToastProvider from "@/provider/toast.provider";
import { type Metadata } from "next";
import { Inter, Lexend } from "next/font/google";

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
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);

  // const pathname = usePathname();

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return (
    <html
      lang="en"
      className={cn(
        "min-h-full scroll-smooth bg-white antialiased",
        inter.variable,
        lexend.variable,
      )}
    >
      <body suppressHydrationWarning={true}>
        <ToastProvider>
          <div className="dark:bg-boxdark-2 dark:text-bodydark">
            {loading ? <Loader /> : <AuthProvider>{children}</AuthProvider>}
          </div>
        </ToastProvider>
      </body>
    </html>
  );
}
