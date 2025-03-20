'use client';
import * as React from 'react';
import { LandingPage } from './(pages)/landing-page';

export default function Home() {
  return (
    <div className="flex flex-col mx-auto justify-center items-center">
      <LandingPage />
    </div>
  );
}
