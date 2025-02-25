import React from "react";
import Link from "next/link";

export const Footer = () => {
  return (
    <footer className="py-8 bg-background z-auto">
      <div className="container px-4 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold mb-4">Liens Utiles</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-sm  hover:text-slate-900">
                  À propos
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm  hover:text-slate-900">
                  Conditions d&aposutilisation
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-sm  hover:text-slate-900">
                  Politique de confidentialité
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-sm  hover:text-slate-900">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};
