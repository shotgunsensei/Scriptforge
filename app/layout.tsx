import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Breadcrumbs } from "./components/navigation/Breadcrumbs";
import { GlobalFooter } from "./components/navigation/GlobalFooter";
import { GlobalHeader } from "./components/navigation/GlobalHeader";
import "./globals.css";

export const metadata: Metadata = {
  title: "OperatorOS ScriptForge",
  description: "Forge Better Automation with free PowerShell scripts for MSPs, sysadmins, and IT professionals.",
  icons: {
    icon: "/branding/favicon.svg",
  },
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <GlobalHeader />
        <Breadcrumbs />
        {children}
        <GlobalFooter />
      </body>
    </html>
  );
}
