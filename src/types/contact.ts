import { Media } from "./media";


export interface Contact {
  id: string;
  name: string;
  logo: string | Media;
  latitude: number;
  longitude: number;
  category: ContactCategory;
  phone?: string | null;
  website?: string | null;
  address?: string | null;
  updatedAt: string;
  createdAt: string;
}

export interface ContactCategory {
  id: string;
  name: string;
  updatedAt: string;
  createdAt: string;
}
