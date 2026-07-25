import { createSupabaseCollectionStore } from "./supabase-collection";
import type { Faq } from "@/lib/data/types";

interface FaqRow {
  id: string;
  question: string;
  answer: string;
  category: string | null;
}

function toDomain(row: FaqRow): Faq {
  return {
    id: row.id,
    question: row.question,
    answer: row.answer,
    category: row.category ?? undefined,
  };
}

function toRow(f: Faq): FaqRow {
  return {
    id: f.id,
    question: f.question,
    answer: f.answer,
    category: f.category ?? null,
  };
}

export const faqsStore = createSupabaseCollectionStore<FaqRow, Faq>("faqs", "id", toDomain, toRow);
