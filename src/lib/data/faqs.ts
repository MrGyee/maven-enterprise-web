import { cache } from "react";
import { faqsStore } from "@/lib/store/faqs.store";

export const getFaqs = cache(async () => {
  return faqsStore.getAll();
});

export const getFaqById = cache(async (id: string) => {
  return faqsStore.getByKey(id);
});
