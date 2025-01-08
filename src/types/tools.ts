export interface Tool {
  id: string;
  name: string;
  description: string | null;
  slug: string;
  created_at: string;
  updated_at: string;
  published: boolean;
  published_at: string | null;
}