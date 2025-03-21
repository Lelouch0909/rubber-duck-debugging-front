'use client';
import * as React from 'react';
import { LandingPage } from './(pages)/landing-page';
import { Layout } from '@/components/Layout/Layout';

export default function Home() {
  return (
    <Layout>
      <div className="grid grid-rows-[600px_1fr_20px] items-center justify-items-center">
        <LandingPage />
      </div>
    </Layout>
  );
}
