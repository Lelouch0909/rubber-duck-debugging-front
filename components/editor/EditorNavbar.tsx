import React from 'react';
import { motion } from 'framer-motion';
import { Truck as Duck, Settings } from 'lucide-react';
import { ModeToggle } from '@/components/toggle-mode/ToggleMode';
import { Btn } from '@/components/common/Button';

function EditorNavbar() {
  return (
    <motion.div
      initial={{ y: -20 }}
      animate={{ y: 0 }}
      className="bd-white/80 dark:bg-gray-800/80 backdrop-blur-sm fixed top-0 right-0 left-0 w-full z-50 border-b border-gray-200 dark:border-gray-700"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center h-16">
          <div className="flex items-center justify-between gap-8 w-full">
            <div className="flex items-center">
              <Duck className="h-8 w-8 text-yellow-400" />
              <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">Duck</span>
            </div>
            <div className="flex items-center gap-2">
              <Btn title="settings" variant={'outline'} size={'icon'}>
                <Settings className="h-6 w-6" />
              </Btn>
              <ModeToggle />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default EditorNavbar;
