import React, { createContext, useContext } from 'react';
import { useResources } from '../hooks/useResources';

type Value = ReturnType<typeof useResources>;

const ResourcesContext = createContext<Value | null>(null);

export function ResourcesProvider({
  userId,
  children,
}: {
  userId: string;
  children: React.ReactNode;
}) {
  const value = useResources(userId);
  return <ResourcesContext.Provider value={value}>{children}</ResourcesContext.Provider>;
}

export function useResourcesContext(): Value {
  const ctx = useContext(ResourcesContext);
  if (!ctx) {
    throw new Error('useResourcesContext must be used within ResourcesProvider');
  }
  return ctx;
}
