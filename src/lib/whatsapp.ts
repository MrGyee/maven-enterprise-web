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

// Contextual message builders so every CTA site-wide generates a
// consistent, useful opening message instead of ad-hoc strings scattered
// across components.
export function buildProductWhatsappMessage(productName: string) {
  return `Hi Maven, I'm interested in ${productName}. Please send me availability and pricing.`;
}

export function buildProjectWhatsappMessage(projectType: string, location: string) {
  return `Hi Maven, I have a ${projectType} project in ${location} and would like a quotation.`;
}

export function buildContractorWhatsappMessage() {
  return "Hi Maven, I'm a contractor and would like information about Maven Trade and project pricing.";
}

export function buildServiceWhatsappMessage(serviceName: string) {
  return `Hi Maven, I'm interested in ${serviceName}. I'd like to discuss my project.`;
}
