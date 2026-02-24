import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata = {
  title: "Elyndra - We Won't Praise It. You'll Experience It.",
  description:
    "Elyndra is the leading online marketplace where you can buy and sell anything across Pakistan. Browse thousands of listings in mobiles, cars, property, electronics, jobs, services, and more in all major cities.",
  keywords: [
    "buy and sell Pakistan",
    "online marketplace Pakistan",
    "classified ads",
    "Elyndra",
    "OLX alternative",
    "sell online",
  ],
  openGraph: {
    title: "Elyndra - We Won't Praise It. You'll Experience It.",
    description:
      "Pakistan's trusted marketplace. Buy and sell mobiles, cars, property, electronics, and more.",
    type: "website",
    locale: "en_PK",
    siteName: "Elyndra",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.className}>
      <body className="min-h-screen bg-gray-50 text-gray-900 antialiased">
        <AuthProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: "#fff",
                color: "#1f2937",
                borderRadius: "0.75rem",
                boxShadow:
                  "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)",
                padding: "12px 16px",
                fontSize: "14px",
              },
              success: {
                iconTheme: {
                  primary: "#16a34a",
                  secondary: "#fff",
                },
              },
              error: {
                iconTheme: {
                  primary: "#dc2626",
                  secondary: "#fff",
                },
              },
            }}
          />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
