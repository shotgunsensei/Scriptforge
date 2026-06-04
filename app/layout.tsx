import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OperatorOS ScriptForge",
  description: "Forge Better Automation with free PowerShell scripts for MSPs, sysadmins, and IT professionals.",
  icons: {
    icon: "/branding/favicon.svg",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
