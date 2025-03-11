import * as React from 'react';
import { Btn } from './Button';
import { Menu } from 'lucide-react';
import Link from 'next/link';

export const Navbar = () => {
  const [isSideBarOpen, setIsSideBarOpen] = React.useState(false);
  const [isSettingOpen, setIsSettingOpen] = React.useState(false);

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm">
      <div className="max-w-8xl mx-auto px-4">
        <div className="flex h-17 items-center justify-between">
          <div className="flex items-center gap-5">
            <Btn
              variant="outline"
              size="icon"
              title={isSideBarOpen ? "Masquer l'explorateur" : "Afficher l'explorateur"}
            >
              <Menu className="h-6 w-6" />
            </Btn>
            <Link href="/" className="flex items-center hover-lift">
              <span className="ml-3 text-xl font-bold text-gray-900 dark:text-white">DuckDown</span>
            </Link>
          </div>
          <div className="flex items-center gap-3"></div>
        </div>
      </div>
    </header>
  );
};
