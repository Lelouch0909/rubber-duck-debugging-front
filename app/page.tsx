'use client'
import * as React from 'react'
import { InputForm } from "@/components/common/Input";
import { Mail, Lock } from 'lucide-react';
import { Navbar } from '@/components/common/Navbar';

import { ModeToggle } from "@/components/toggle-mode/ToggleMode";
import { Button } from "@/components/ui/button";


export default function Home() {
  const [email, setEmail] = React.useState('')

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <h1>Hello World</h1>
        <Navbar />
        <Button>Click Me</Button>
        <ModeToggle />
      </main>
    </div>
  );
}
