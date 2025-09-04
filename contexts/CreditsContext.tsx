"use client";

import React, { createContext, useContext, useState } from 'react';

interface CreditsContextType {
  credits: number;
  setCredits: (credits: number) => void;
  consumeCredit: () => boolean;
}

const CreditsContext = createContext<CreditsContextType | undefined>(undefined);

export function CreditsProvider({ children }: { children: React.ReactNode }) {
  const [credits, setCredits] = useState(3);

  const consumeCredit = () => {
    if (credits > 0) {
      setCredits(credits - 1);
      return true;
    }
    return false;
  };

  const value = {
    credits,
    setCredits,
    consumeCredit,
  };

  return (
    <CreditsContext.Provider value={value}>
      {children}
    </CreditsContext.Provider>
  );
}

export function useCredits() {
  const context = useContext(CreditsContext);
  if (context === undefined) {
    throw new Error('useCredits must be used within a CreditsProvider');
  }
  return context;
}
