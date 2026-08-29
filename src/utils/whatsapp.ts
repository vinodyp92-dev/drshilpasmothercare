export function formatWhatsappNumber(numStr?: string): string {
  if (!numStr) return '';
  const raw = numStr.replace(/\D/g, '');
  return raw.length === 10 ? `91${raw}` : raw;
}

export function openWhatsappChat(phoneNumber: string, message: string): void {
  const cleanPhone = formatWhatsappNumber(phoneNumber);
  if (!cleanPhone) return;
  const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank', 'noopener,noreferrer');
}

export interface BookingMessageInput {
  clinicName: string;
  patientName: string;
  patientPhone: string;
  preferredDate: string;
  preferredTime?: string;
  doctorName: string;
  service: string;
  patientType?: string;
  reason?: string;
}

export function buildBookingRequestMessage(input: BookingMessageInput): string {
  const lines = [
    `🌸 *APPOINTMENT REQUEST — ${input.clinicName}*`,
    '----------------------------------------',
    `*Patient Name:* ${input.patientName}`,
    `*Phone:* ${input.patientPhone}`,
    `*Patient Type:* ${input.patientType || 'New Patient'}`,
    `*Preferred Date:* ${input.preferredDate}`,
  ];

  if (input.preferredTime) {
    lines.push(`*Preferred Time:* ${input.preferredTime}`);
  }

  lines.push(
    `*Doctor:* ${input.doctorName}`,
    `*Service:* ${input.service}`,
  );

  if (input.reason?.trim()) {
    lines.push(`*Reason for Visit:* ${input.reason.trim()}`);
  }

  lines.push(
    '----------------------------------------',
    'Please confirm my appointment slot. Thank you!'
  );

  return lines.join('\n');
}
