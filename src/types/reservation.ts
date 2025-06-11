import { Message } from "./chat";
import { User } from "./user";


export interface Reservation {
  id: string;
  title: string;
  app_user: User;
  desk: '1' | '2' | '3';
  invitations?:
    | {
        email: string;
        id?: string | null;
      }[]
    | null;
  day_reservation: string;
  start_time_reservation: string;
  end_time_reservation: string;
  updatedAt: string;
  createdAt: string;
}

export const labels = {
  "1": "Bureau 1",
  "2": "Bureau 2",
  "3": "Bureau 3",
} as const;

