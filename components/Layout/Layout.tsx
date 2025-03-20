import React from 'react';
import { Navbar } from '@/components/common/Navbar';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen font-[family-name:var(--font-geist-sans)] overflow-hidden px-4 sm:px-6 lg:px-12">
      <Navbar />
      <main className="flex-grow container mx-auto px-4">{children}</main>
      <footer className="text-white p-4 border-t border-gray-800 dark:border-gray-500 dark:text-gray-200">
        <div className="container mx-auto text-center text-gray-950 dark:text-gray-200">
          <p>© {new Date().getFullYear()} Rubber Duck App. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};
