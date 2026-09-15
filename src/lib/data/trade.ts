import { tradeStore, type TradeApplicationStatus } from "@/lib/store/trade.store";
import type { TradeApplicationValues } from "@/lib/validation/forms";

export async function getTradeApplications() {
  return tradeStore.getAll();
}

export async function getTradeApplicationById(id: string) {
  return tradeStore.getById(id);
}

export async function saveTradeApplication(values: TradeApplicationValues) {
  return tradeStore.create(values);
}

export async function updateTradeApplication(
  id: string,
  patch: { status?: TradeApplicationStatus; adminNotes?: string | null }
) {
  return tradeStore.updateStatus(id, patch);
}
