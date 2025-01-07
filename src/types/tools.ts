export interface Tool {
  id: string;
  name: string;
  description: string | null;
  url: string | null;
  category_id: string | null;
  slug: string;
  created_at: string;
  updated_at: string;
}