import React from 'react';
import { motion } from 'framer-motion';

function HeroSection() {
  return (
    <motion.section
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col gap-4 items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
    >
      {/* Main Heading */}
      <motion.p
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        exit={{ opacity: 0 }}
        className="text-center text-3xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white"
      >
        Markdown avec votre
        <br />
        <span className="text-blue-400">Assitant de débogage rapide</span>
      </motion.p>

      {/* Subheading */}
      <p className="text-center text-sm sm:text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
        Créez et modifiez votre contenu en Markdown. Vous pouvez également personnaliser l'apparence
        et le comportement de votre contenu en utilisant des composants.
      </p>

      {/* Buttons */}
      <div className="flex flex-wrap justify-center gap-4 mt-4">
        <button
          title="get started"
          className="bg-blue-500 text-white text-sm sm:text-base px-4 py-2 rounded-md hover:bg-blue-600 transition-all duration-200 font-bold shadow-md"
        >
          Commencer
        </button>
        <button
          title="Documentation"
          className="text-sm sm:text-base px-4 py-2 font-bold rounded-md border border-gray-300 hover:border-blue-500 hover:bg-gray-100 dark:border-gray-700 dark:hover:border-blue-500 dark:hover:bg-gray-800 dark:text-white transition-all duration-200 shadow-md"
        >
          Documentation
        </button>
      </div>
    </motion.section>
  );
}

export default HeroSection;
