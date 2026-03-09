import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
    title: "Pipedrive KPI Dashboard",
    description: "Advanced Analytics for Pipedrive Teams",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="pt-PT" className={inter.variable}>
            <body className="antialiased bg-black text-white min-h-screen">
                {children}
            </body>
        </html>
    );
}
