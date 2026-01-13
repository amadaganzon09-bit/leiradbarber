import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import LoadingScreen from "@/components/ui/LoadingScreen";
import { LoadingProvider } from "@/context/LoadingContext";
import { ToastProvider } from "@/components/ui/Toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Leirad | Precision Grooming Redefined",
  description: "Experience the ultimate in precision grooming with the Leirad Trimmer.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased selection:bg-white/20 selection:text-white`}>
        <LoadingProvider>
          <ToastProvider>
            <LoadingScreen />
            {children}
          </ToastProvider>
        </LoadingProvider>
      </body>
    </html>
  );
}
