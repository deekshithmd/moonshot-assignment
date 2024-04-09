import "@/styles/globals.css";
import { Inter } from "next/font/google";
import { TRPCReactProvider } from "@/trpc/react";
import { DataProvider } from './contexts/DataContext';
import { Header } from './_components/Header';

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "Ecommerce",
  description: "Ecommerce Application",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`font-sans ${inter.variable} h-screen`}>
        <TRPCReactProvider>
          <DataProvider>
            <Header />
            {children}
          </DataProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
