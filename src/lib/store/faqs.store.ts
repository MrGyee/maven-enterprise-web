import { createCollectionStore } from "./collection";
import type { Faq } from "@/lib/data/types";

export const faqsStore = createCollectionStore<Faq>("faqs.json", (f) => f.id);
