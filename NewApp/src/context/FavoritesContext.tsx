import React, { createContext, useState, useContext, ReactNode } from 'react';

export interface Resource {
  id: string;
  title: string;
  description: string;
  url?: string;
  category: string;
  tags: string[];
  type?: 'tutorial' | 'repo' | 'note' | 'snippet' | 'article';
  image?: string;
  sourceLogo?: string;
  createdAt?: number;
  source?: string;
}

interface FavoritesContextType {
  favorites: Resource[];
  toggleFavorite: (resource: Resource) => void;
  isFavorite: (id: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<Resource[]>([]);

  const toggleFavorite = (resource: Resource) => {
    setFavorites((prev) => {
      const exists = prev.find((item) => item.id === resource.id);
      if (exists) {
        return prev.filter((item) => item.id !== resource.id);
      }
      return [...prev, resource];
    });
  };

  const isFavorite = (id: string) => {
    return favorites.some((item) => item.id === id);
  };

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}
