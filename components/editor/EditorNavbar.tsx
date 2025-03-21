'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Truck as Duck, Menu, Settings } from 'lucide-react';
import { ModeToggle } from '@/components/toggle-mode/ToggleMode';
import { ImperativePanelHandle } from 'react-resizable-panels';

type Props = {
  isSidebarOpen: boolean;
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isEditorOpen: boolean;
  setIsEditorOpen: React.Dispatch<React.SetStateAction<boolean>>;
  panelEditorRef: React.RefObject<ImperativePanelHandle | null>;
  panelSidebarRef: React.RefObject<ImperativePanelHandle | null>;
};

function EditorNavbar({
  isSidebarOpen,
  setIsSidebarOpen,
  isEditorOpen,
  setIsEditorOpen,
  panelEditorRef,
  panelSidebarRef,
}: Props) {
  const handelToggleSidebar = (prev: boolean) => {
    setIsSidebarOpen(!prev);
    panelSidebarRef.current?.resize(isSidebarOpen ? 0 : panelSidebarRef.current?.getSize() + 30);
    if (panelEditorRef.current?.getSize() !== 0 && isEditorOpen) {
      panelEditorRef.current?.resize(0);
      setIsEditorOpen(false);
    }
  };

  const handelToggleEditor = (prev: boolean) => {
    setIsEditorOpen(!prev);
    panelEditorRef.current?.resize(isEditorOpen ? 0 : panelEditorRef.current?.getSize() + 50);
    if (panelSidebarRef.current?.getSize() !== 0 && isSidebarOpen) {
      panelSidebarRef.current?.resize(0);
      setIsSidebarOpen(false);
    }
  };

  return (
    <motion.div
      initial={{ y: -20 }}
      animate={{ y: 0 }}
      className="bd-white/80 dark:bg-gray-800/80 backdrop-blur-sm fixed top-0 right-0 left-0 w-full z-50 border-b border-gray-200 dark:border-gray-700"
    >
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
        <div className="flex items-center justify-between h-11 py-1">
          <div className="flex items-center gap-2 h-full">
            <button
              onClick={() => handelToggleSidebar(isSidebarOpen)}
              className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="flex-grow w-[2px] h-full bg-gray-200 dark:bg-gray-700" />
          </div>
          <div className="flex items-center justify-center gap-8 w-full">
            <div className="flex items-center">
              <Duck className="h-8 w-8 text-yellow-400" />
              <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">Duck</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
              onClick={() => handelToggleEditor(isEditorOpen)}
            >
              <Settings className="h-6 w-6" />
            </button>
            <ModeToggle />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default EditorNavbar;
