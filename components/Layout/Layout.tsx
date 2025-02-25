import React from "react";
import { Header } from "@/components/Headers/Header";
import { Theme } from "@radix-ui/themes";
import { ThemeProvider } from "next-themes";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <ThemeProvider attribute="class">
      <Theme appearance="inherit">
        <Header />
        <main className="flex-1">{children}</main>
      </Theme>
    </ThemeProvider>
  );
};
