export interface Category {
  id: string;
  name: string;
  description: string | null;
  parent_id: string | null;
  slug: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}