import type { Metadata } from "next";
import { Roboto, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const roboto = Roboto({
  weight: ['100', '300', '400', '500', '700', '900'],
  variable: "--font-roboto",
  subsets: ["latin", "vietnamese"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin", "vietnamese"],
});

export const metadata: Metadata = {
  title: "CECICS - Hệ thống Quản lý Thiết bị",
  description: "Giải pháp quản lý thiết bị hiện đại, tối ưu hóa quy trình mượn trả tại kho.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className={`${roboto.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
