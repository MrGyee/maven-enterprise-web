import { faqsStore } from "@/lib/store/faqs.store";

export async function getFaqs() {
  return faqsStore.getAll();
}

export async function getFaqById(id: string) {
  return faqsStore.getByKey(id);
}
