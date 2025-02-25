import { Search, Sun, PiIcon as RubberDuck } from "lucide-react";
import Link from "next/link";
import React from "react";

interface HeaderProps {}

export const Header = (props: HeaderProps) => {
  return (
    <div className="bg-slate-100 relative z-50 mx-auto py-1.5">
      <nav className="mx-auto flex justify-between container px-14">
        {/* Left Navigation */}
        <div className="relative flex justify-start items-center order-2 lg:order-1 flex-1 lg:flex-initial">
          <Link
            href="/"
            className="text-2xl font-bold flex flex-row justify-center items-center gap-2"
          >
            <RubberDuck />
            Rubber Duck
          </Link>
        </div>
        {/* Center Navigation */}
        <div className="flex lg:flex-1 justify-center order-1 lg:order-2 mr-3 lg:mr-0">
          <div className="hidden lg:flex lg:gap-x-6 items-center">
            <Link
              href="/auth/login"
              className="text-sm font-medium text-slate-700 hover:text-slate-900"
            >
              Sign in
            </Link>
            <Link
              href="/auth/register"
              className="text-sm font-medium text-slate-700 hover:text-slate-900"
            >
              Sign up
            </Link>
          </div>
        </div>
        {/* Right Navigation */}
        <div className="flex justify-end items-center gap-2 order-3">
          <button className="p-1.5 text-sm inline-flex items-center justify-center font-medium text-slate-800 rounded-md border-2 border-slate-200 hover:border-slate-300 bg-slate-200 hover:bg-slate-300">
            <Search className="w-4 h-4" />
          </button>
          <div className="relative">
            <button className="p-1.5 text-sm inline-flex items-center justify-center font-medium text-slate-800 rounded-md border-2 border-slate-200 hover:border-slate-300 bg-slate-200 hover:bg-slate-300">
              <Sun className="w-4 h-4" />
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
};
