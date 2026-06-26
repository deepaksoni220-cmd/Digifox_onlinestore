import { Inter, Galada, Manrope } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-main",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const galada = Galada({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  title: "Pure Zero - 5D Drink Experience",
  description: "Experience the next level of refreshment with our 5D drinks.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preload" href="/assets/deit_soda2.glb" as="fetch" crossOrigin="anonymous" />
        <link rel="preload" href="/assets/cherry.glb" as="fetch" crossOrigin="anonymous" />
        <link rel="preload" href="/assets/blueberry.glb" as="fetch" crossOrigin="anonymous" />
        <link rel="preload" href="/assets/leaves.glb" as="fetch" crossOrigin="anonymous" />
        <link rel="preload" href="/assets/blue_base_color.jpg" as="image" />
        <link rel="preload" href="/assets/green_base_color.jpg" as="image" />
      </head>
      <body className={`${inter.variable} ${galada.variable} ${manrope.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
