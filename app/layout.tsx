import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import "@ant-design/v5-patch-for-react-19";
import ThemeRegistry from "@/components/theme-registry";
import Providers from "@/app/providers";
import "./globals.css";

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto",
});

export const metadata: Metadata = {
  title: "DARCA Asset Intelligence",
  description: "DARCA asset management portal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={roboto.variable}>
      <body style={{ minHeight: "100%", display: "flex", flexDirection: "column" }}>
        <AntdRegistry>
          <ThemeRegistry>
            <Providers>{children}</Providers>
          </ThemeRegistry>
        </AntdRegistry>
      </body>
    </html>
  );
}
