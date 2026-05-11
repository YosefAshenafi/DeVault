import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Resource } from './FavoritesContext';

interface ResourceContextType {
  resources: Resource[];
  addResource: (resource: Resource) => void;
  removeResource: (id: string) => void;
  importResources: (newResources: Resource[]) => void;
  loading: boolean;
  updateSourceLogo: (sourceName: string, newLogoUrl: string) => void;
  renameSource: (oldName: string, newName: string) => void;
  deleteSource: (sourceName: string) => void;
  updateResource: (id: string, updatedFields: Partial<Resource>) => void;
}

const STORAGE_KEY = '@devvault_resources';

const INITIAL_RESOURCES: Resource[] = [
  {
    id: 'rec1',
    title: 'Modern CSS Layouts with Grid and Flexbox for 2024 and beyond',
    description: 'New grid and flex tricks for 2024 that will change how you build responsive interfaces forever. Learn the secret properties...',
    category: 'tutorial',
    tags: ['CSS', 'WEB'],
    type: 'tutorial',
    image: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?auto=format&fit=crop&q=80&w=400&h=400',
    createdAt: Date.now() - 3600000,
    source: 'TikTok',
    sourceLogo: 'https://cdn-icons-png.flaticon.com/512/3046/3046121.png'
  },
  {
    id: 'rec2',
    title: 'React Performance Tip: Memoization and beyond with useMemo and useCallback',
    description: 'Avoid unnecessary re-renders with this simple trick that every developer should know when working with large state objects...',
    category: 'snippet',
    tags: ['REACT'],
    type: 'snippet',
    image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=400&h=400',
    createdAt: Date.now() - 7200000,
    source: 'YouTube',
    sourceLogo: 'https://cdn-icons-png.flaticon.com/512/1384/1384060.png'
  },
  {
    id: '1',
    title: 'Mastering RSC in Next.js',
    description: 'Deep dive into the architecture of RSC...',
    category: 'tutorial',
    tags: ['REACT', 'NEXTJS'],
    type: 'tutorial',
    createdAt: Date.now() - 14400000,
    source: 'YouTube',
    sourceLogo: 'https://cdn-icons-png.flaticon.com/512/1384/1384060.png'
  },
  {
    id: '2',
    title: 'facebook/react-native',
    description: 'A framework for building native applications...',
    category: 'repo',
    tags: ['MOBILE', 'IOS'],
    type: 'repo',
    createdAt: Date.now() - 18000000,
    source: 'GitHub',
    sourceLogo: 'https://cdn-icons-png.flaticon.com/512/25/25231.png'
  },
  {
    id: '3',
    title: 'Minimalist UI Trends',
    description: 'Exploring the shift to glassmorphism...',
    category: 'article',
    tags: ['DESIGN', 'UI'],
    type: 'article',
    image: 'https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&q=80&w=400&h=400',
    createdAt: Date.now() - 86400000,
    source: 'TikTok',
    sourceLogo: 'https://cdn-icons-png.flaticon.com/512/3046/3046121.png'
  },
  {
    id: '4',
    title: 'UserVault sync API',
    description: 'interface UserVault [ id:_',
    category: 'snippet',
    tags: ['API', 'SYNC'],
    type: 'snippet',
    createdAt: Date.now() - 90000000,
    source: 'GitHub',
    sourceLogo: 'https://cdn-icons-png.flaticon.com/512/25/25231.png'
  },
  {
    id: '5',
    title: 'AI Productivity Tools',
    description: 'A list of the best AI tools for devs...',
    category: 'article',
    tags: ['AI', 'TOOLS'],
    type: 'article',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=200&h=200',
    createdAt: Date.now() - 172800000,
    source: 'LinkedIn',
    sourceLogo: 'https://cdn-icons-png.flaticon.com/512/174/174857.png'
  }
];

const ResourceContext = createContext<ResourceContextType | undefined>(undefined);

export const ResourceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadResources();
  }, []);

  const loadResources = async () => {
    try {
      if (!AsyncStorage || typeof AsyncStorage.getItem !== 'function') {
        console.warn('AsyncStorage is not available. Using initial resources.');
        setResources(INITIAL_RESOURCES);
        setLoading(false);
        return;
      }
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        setResources(JSON.parse(stored));
      } else {
        setResources(INITIAL_RESOURCES);
      }
    } catch (e) {
      console.warn('Failed to load resources from storage, falling back to initial data:', e);
      setResources(INITIAL_RESOURCES);
    } finally {
      setLoading(false);
    }
  };

  const saveToStorage = async (data: Resource[]) => {
    try {
      if (AsyncStorage && typeof AsyncStorage.setItem === 'function') {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      }
    } catch (error) {
      console.error('Failed to save resources', error);
    }
  };

  const addResource = (resource: Resource) => {
    const updated = [resource, ...resources];
    setResources(updated);
    saveToStorage(updated);
  };

  const removeResource = (id: string) => {
    const updated = resources.filter(r => r.id !== id);
    setResources(updated);
    saveToStorage(updated);
  };

  const updateResource = (id: string, updatedFields: Partial<Resource>) => {
    const updated = resources.map(r => 
      r.id === id ? { ...r, ...updatedFields } : r
    );
    setResources(updated);
    saveToStorage(updated);
  };

  const importResources = (newResources: Resource[]) => {
    setResources(newResources);
    saveToStorage(newResources);
  };

  const updateSourceLogo = (sourceName: string, newLogoUrl: string) => {
    const updated = resources.map(r => 
      r.source === sourceName ? { ...r, sourceLogo: newLogoUrl } : r
    );
    setResources(updated);
    saveToStorage(updated);
  };

  const renameSource = (oldName: string, newName: string) => {
    const updated = resources.map(r => 
      r.source === oldName ? { ...r, source: newName } : r
    );
    setResources(updated);
    saveToStorage(updated);
  };

  const deleteSource = (sourceName: string) => {
    const updated = resources.filter(r => r.source !== sourceName);
    setResources(updated);
    saveToStorage(updated);
  };

  return (
    <ResourceContext.Provider value={{ resources, addResource, removeResource, importResources, updateSourceLogo, renameSource, deleteSource, updateResource, loading }}>
      {children}
    </ResourceContext.Provider>
  );
};

export const useResources = () => {
  const context = useContext(ResourceContext);
  if (context === undefined) {
    throw new Error('useResources must be used within a ResourceProvider');
  }
  return context;
};
