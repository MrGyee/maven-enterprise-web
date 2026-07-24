import { faqsStore } from "@/lib/store/faqs.store";

export function getFaqs() {
  return faqsStore.getAll();
}

export function getFaqById(id: string) {
  return faqsStore.getByKey(id);
}
