import { Media } from "./media";


export interface Fundesys {
  date: string;
  file: string | Media;
  video: string | Media;
  updatedAt: string;
  createdAt: string;
}