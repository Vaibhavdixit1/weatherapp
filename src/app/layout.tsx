"use client";
import { Inter } from "next/font/google";
import "./globals.css";
import { QueryClient, QueryClientProvider } from "react-query";
import Footer from "@/components/Footer";
import { ThemeProvider } from "next-themes";
import OfflineWrapper from "@/components/OfflineWrapper";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = new QueryClient();

  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head>
      <OfflineWrapper>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem={true}
            disableTransitionOnChange
          >
            <body className={inter.className}>
              {children}
              <Footer />
            </body>
          </ThemeProvider>
        </QueryClientProvider>
      </OfflineWrapper>
    </html>
  );
}
