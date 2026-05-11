export type Resource = {
  id: string;
  userId: string;
  title: string;
  url: string | null;
  note: string;
  tags: string;
  thumbnailUrl: string | null;
  description: string | null;
  siteName: string | null;
  favicon: string | null;
  createdAt: number;
  updatedAt: number;
};

export type ResourceInput = {
  title: string;
  url: string | null;
  note: string;
  tags: string;
  thumbnailUrl: string | null;
  description: string | null;
  siteName: string | null;
  favicon: string | null;
};

export type SharePayload = {
  url: string;
  titleGuess: string;
  rawText?: string;
};
