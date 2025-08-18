import React from 'react';
import { UserButton } from '@clerk/nextjs';

export default function Home() {
  return (
    <div>
      <h1><strong>EduXHub :  Online Learning Platform</strong></h1>
      <UserButton />
    </div>
  );
}

