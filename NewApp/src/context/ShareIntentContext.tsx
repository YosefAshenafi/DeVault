import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export interface SharedContent {
  url?: string;
  text?: string;
  title?: string;
  image?: string;
  source?: string;
  sourceLogo?: string;
}

interface ShareIntentContextType {
  sharedContent: SharedContent | null;
  setSharedContent: (content: SharedContent | null) => void;
  isFromShare: boolean;
  clearSharedContent: () => void;
}

const ShareIntentContext = createContext<ShareIntentContextType | undefined>(undefined);

export function ShareIntentProvider({ children }: { children: ReactNode }) {
  const [sharedContent, setSharedContentState] = useState<SharedContent | null>(null);
  const [isFromShare, setIsFromShare] = useState(false);

  const setSharedContent = useCallback((content: SharedContent | null) => {
    setSharedContentState(content);
    setIsFromShare(content !== null);
  }, []);

  const clearSharedContent = useCallback(() => {
    setSharedContentState(null);
    setIsFromShare(false);
  }, []);

  return (
    <ShareIntentContext.Provider value={{ sharedContent, setSharedContent, isFromShare, clearSharedContent }}>
      {children}
    </ShareIntentContext.Provider>
  );
}

export function useShareIntent() {
  const context = useContext(ShareIntentContext);
  if (context === undefined) {
    throw new Error('useShareIntent must be used within a ShareIntentProvider');
  }
  return context;
}
