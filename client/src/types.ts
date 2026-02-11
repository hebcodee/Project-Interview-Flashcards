import { z } from "zod";

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
}

export interface Card {
  id: number;
  categoryId: number;
  question: string;
  answer: string;
}

export type CategoryWithCards = Category & { cards: Card[] };

export const insertCardSchema = z.object({
  categoryId: z.number(),
  question: z.string().min(1),
  answer: z.string().min(1),
});

export type InsertCard = z.infer<typeof insertCardSchema>;
