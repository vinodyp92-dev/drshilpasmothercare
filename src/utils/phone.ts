export function formatTelHref(phone?: string): string {
  if (!phone) return '';
  return `tel:${phone.replace(/[^0-9+]/g, '')}`;
}
