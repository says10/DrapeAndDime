import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "DrapeAndDime",
  description: "Fashion Ecommerce store",
  icons: "/logo.ico",
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
