import { Media } from "./media";

export interface Formation {
  id: string;
  photo?: Media;
  pdf?: Media;
  title: string;
  date: string;
  inscription_url: string;
  deadline?: string | null;
  price: string;
  presence: ('presentiel' | 'en_ligne')[];
  author: string;
  duration?: string | null;
  updatedAt: string;
  createdAt: string;
}
