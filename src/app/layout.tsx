// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./providers/ThemeProvider";
import { AuthInitializer } from "./providers/AuthInitializer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sistema de Correspondencia y Archivo",
  description:
    "Sistema integral de gestión documental para correspondencia, archivo y préstamos",
  keywords: ["correspondencia", "archivo", "gestión documental", "préstamos"],
  authors: [{ name: "Equipo de Desarrollo" }],
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider>
          <AuthInitializer>{children}</AuthInitializer>
        </ThemeProvider>
      </body>
    </html>
  );
}
