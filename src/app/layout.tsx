import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Bát Tự AI — Luận Giải Mệnh Lý Chuyên Sâu",
  description:
    "Lập lá số Bát Tự chính xác bằng thuật toán thiên văn, kết hợp AI phân tích chuyên sâu sự nghiệp, tài lộc, tình duyên, sức khỏe và 10 đại vận.",
  keywords: "bát tự, tử bình, lá số, mệnh lý, phong thủy, AI, luận giải",
  openGraph: {
    title: "Bát Tự AI — Luận Giải Mệnh Lý Chuyên Sâu",
    description: "Lập lá số và luận giải bát tự chuyên sâu bằng AI",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={cn("dark", inter.variable)} suppressHydrationWarning>
      <body className="min-h-screen font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
