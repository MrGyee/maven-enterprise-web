// Client-safe (no server-only APIs): usable from both Server and Client
// Components. The WhatsApp number itself is admin-editable business data,
// so callers pass it in explicitly (fetched server-side via
// businessInfoStore.get(), threaded down as a prop where needed on the
// client) rather than this module reading the store directly.
export const defaultWhatsappMessage =
  "Hello Maven Enterprise Ltd. I would like to inquire about your products and services.";

export function buildWhatsappLink(whatsappNumber: string, message: string) {
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
}
