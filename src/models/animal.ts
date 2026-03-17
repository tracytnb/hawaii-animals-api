export interface Animal {
  id: number;
  common_name: string;
  hawaiian_name: string;
  scientific_name: string;
  category: string;
  animal_class?: string;
  habitat?: string;
  island_found?: string[];
  native_status?: 'native' | 'endemic' | 'introduced' | 'invasive';
  conservation_status?: string;
  // diet?: string;
  description?: string;
  // image_url?: string;
  // created_at?: string;
  // updated_at?: string;
}
