import * as React from 'react';
import { Btn } from './Button';
import { LogOutIcon, Menu, SettingsIcon } from 'lucide-react';
import Link from 'next/link';
import { ModeToggle } from '../toggle-mode/ToggleMode';

interface Props {
  isSideBarOpen: boolean;
  setIsSideBarOpen: (value: boolean) => void;
  isSettingOpen: boolean;
  setIsSettingOpen: (value: boolean) => void;
}

export const Navbar: React.FC<Props> = ({
  isSideBarOpen,
  setIsSideBarOpen,
  isSettingOpen,
  setIsSettingOpen,
}) => (
  <header className="bg-white dark:bg-gray-800 shadow-sm dark:shadow-none">
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
        <div className="flex items-center gap-3">
          <ModeToggle />
          <Btn
            size={'icon'}
            variant={'default'}
            onClick={() => setIsSettingOpen(true)}
            title="Paramètre"
          >
            <SettingsIcon className="h-5 w-5" />
          </Btn>
          <Btn title="Se déconnecter" size={'icon'}>
            <LogOutIcon className="h-5 w-5" />
          </Btn>
        </div>
      </div>
    </div>
  </header>
);
