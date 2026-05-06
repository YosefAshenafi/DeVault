import { useCallback, useEffect, useState } from 'react';
import type { Resource, ResourceInput } from '../types/resource';
import {
  createResource,
  deleteResource,
  getTopTags,
  listResources,
  updateResource,
} from '../data/resourceRepository';

export function useResources(userId: string | null) {
  const [resources, setResources] = useState<Resource[]>([]);
  const [topTags, setTopTags] = useState<{ tag: string; count: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeTag, setActiveTag] = useState<string | undefined>();

  const reloadTags = useCallback(async () => {
    if (!userId) {
      setTopTags([]);
      return;
    }
    const tags = await getTopTags(userId);
    setTopTags(tags);
  }, [userId]);

  const refresh = useCallback(async () => {
    if (!userId) {
      setResources([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const list = await listResources(userId, {
        search: search.trim() || undefined,
        tag: activeTag,
      });
      setResources(list);
    } finally {
      setLoading(false);
    }
  }, [userId, search, activeTag]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useEffect(() => {
    void reloadTags();
  }, [reloadTags]);

  const addResource = useCallback(
    async (input: ResourceInput) => {
      if (!userId) throw new Error('Not signed in');
      const r = await createResource(userId, input);
      await refresh();
      await reloadTags();
      return r;
    },
    [userId, refresh, reloadTags],
  );

  const saveResource = useCallback(
    async (id: string, input: ResourceInput) => {
      if (!userId) throw new Error('Not signed in');
      const r = await updateResource(userId, id, input);
      await refresh();
      await reloadTags();
      return r;
    },
    [userId, refresh, reloadTags],
  );

  const removeResource = useCallback(
    async (id: string) => {
      if (!userId) throw new Error('Not signed in');
      await deleteResource(userId, id);
      await refresh();
      await reloadTags();
    },
    [userId, refresh, reloadTags],
  );

  return {
    resources,
    topTags,
    loading,
    search,
    setSearch,
    activeTag,
    setActiveTag,
    refresh,
    reloadTags,
    addResource,
    saveResource,
    removeResource,
  };
}
