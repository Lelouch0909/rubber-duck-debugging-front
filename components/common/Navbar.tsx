'use client';

import * as React from 'react';
import { Btn } from './Button';
import { Menu } from 'lucide-react';
import Link from 'next/link';

export const Navbar = () => {
  const [isSideBarOpen, setIsSideBarOpen] = React.useState(false);
  const [isSettingOpen, setIsSettingOpen] = React.useState(false);

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm py-2 px-4 sm:px-6 lg:px-8 z-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex h-17 items-center justify-between">
          <div className="flex items-center gap-5">
            <Btn
              variant="outline"
              size="icon"
              title={isSideBarOpen ? "Masquer l'explorateur" : "Afficher l'explorateur"}
            >
              <Menu className="h-6 w-6" />
            </Btn>
            <div className="p-4">
              <div className="container mx-auto flex items-center justify-center md:justify-start">
                <span role="img" aria-label="Rubber Duck" className="text-3xl hover:animate-bounce">
                  🦆
                </span>
                <h1 className="text-2xl font-bold ml-2">DuckDown</h1>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
