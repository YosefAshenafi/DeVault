import {
  ShareIntentProvider as ExpoShareIntentProvider,
  useShareIntentContext as useExpoShareIntentContext,
} from 'expo-share-intent';
import * as Linking from 'expo-linking';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { AppState, type AppStateStatus, Platform } from 'react-native';
import type { SharePayload } from '../types/resource';
import { parseShareDeepLink, parseShareText } from './sharePayload';

type ShareIntentContextValue = {
  payload: SharePayload | null;
  consumePayload: () => void;
};

const ShareIntentContext = createContext<ShareIntentContextValue | null>(null);

function SharePayloadBridge({ children }: { children: React.ReactNode }) {
  const expo = useExpoShareIntentContext();
  const [payload, setPayload] = useState<SharePayload | null>(null);

  const consumePayload = useCallback(() => {
    setPayload(null);
    expo.resetShareIntent();
  }, [expo]);

  useEffect(() => {
    if (!expo.isReady || !expo.hasShareIntent) return;
    const raw = (expo.shareIntent.webUrl ?? expo.shareIntent.text ?? '').trim();
    const fromNative = parseShareText(raw);
    if (fromNative) setPayload(fromNative);
  }, [expo.isReady, expo.hasShareIntent, expo.shareIntent.webUrl, expo.shareIntent.text]);

  useEffect(() => {
    const apply = (url: string | null) => {
      if (!url) return;
      const fromScheme = parseShareDeepLink(url);
      if (fromScheme) {
        setPayload(fromScheme);
        return;
      }
      const fromText = parseShareText(url);
      if (fromText) setPayload(fromText);
    };

    void Linking.getInitialURL().then(apply);
    const sub = Linking.addEventListener('url', (ev) => {
      apply(ev.url);
    });
    return () => sub.remove();
  }, []);

  useEffect(() => {
    const onChange = (state: AppStateStatus) => {
      if (state === 'active') {
        void Linking.getInitialURL().then((url) => {
          if (!url) return;
          const p = parseShareDeepLink(url) ?? parseShareText(url);
          if (p) setPayload(p);
        });
      }
    };
    const sub = AppState.addEventListener('change', onChange);
    return () => sub.remove();
  }, []);

  return (
    <ShareIntentContext.Provider value={{ payload, consumePayload }}>{children}</ShareIntentContext.Provider>
  );
}

export function ShareIntentProvider({ children }: { children: React.ReactNode }) {
  return (
    <ExpoShareIntentProvider options={{ scheme: 'devault', disabled: Platform.OS === 'web' }}>
      <SharePayloadBridge>{children}</SharePayloadBridge>
    </ExpoShareIntentProvider>
  );
}

export function useShareIntentContext(): ShareIntentContextValue {
  const ctx = useContext(ShareIntentContext);
  if (!ctx) {
    throw new Error('useShareIntentContext must be used within ShareIntentProvider');
  }
  return ctx;
}
