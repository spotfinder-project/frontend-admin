import type { Metadata } from "next";
import "./globals.css";
import "remixicon/fonts/remixicon.css";
import Script from "next/script";
import GlobalSWRConfig from "./swrConfig";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

export const metadata: Metadata = {
  title: "Spot Finder Admin",
  description: "Spot Finder Admin",
};

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <>
      <Script src="//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js" />
      <html lang="en" data-theme="corporate">
        <body>
          <GlobalSWRConfig>{props.children}</GlobalSWRConfig>
          <ToastContainer theme="colored" position="bottom-center" />
        </body>
      </html>
    </>
  );
}
