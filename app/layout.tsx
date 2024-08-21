import type { Metadata } from "next";
import "./globals.css";
import "remixicon/fonts/remixicon.css";

export const metadata: Metadata = {
  title: "Spot Finder Admin",
  description: "Spot Finder Admin",
};

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{props.children}</body>
    </html>
  );
}
