import type { Metadata } from "next";
import { Poppins, Kalam, Rajdhani } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const kalam = Kalam({
  variable: "--font-kalam",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const rajdhani = Rajdhani({
  variable: "--font-rajdhani",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Dicas de ofertas e achadinhos",
  description: "Entre no nosso grupo exclusivo de WhatsApp e recebe as melhores promoções antes de todo mundo!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${poppins.variable} ${kalam.variable} ${rajdhani.variable}`}>
        {children}
      </body>
    </html>
  );
}
