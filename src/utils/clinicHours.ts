/** Single source of truth for clinic consultation timings. Edit here only. */

interface TimePoint {
  hour: number;
  minute: number;
}

interface TimeWindow {
  start: TimePoint;
  end: TimePoint;
}

const toMinutes = ({ hour, minute }: TimePoint) => hour * 60 + minute;

const formatTime = (hour: number, minute: number) => {
  const period = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  const paddedMinute = minute.toString().padStart(2, '0');
  return `${hour12}:${paddedMinute} ${period}`;
};

const formatSlotTime = (hour: number, minute: number) => {
  const period = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  return `${hour12.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')} ${period}`;
};

const EVENING_CONSULTATION: TimeWindow = { start: { hour: 16, minute: 30 }, end: { hour: 20, minute: 30 } };

const EVENING_HOURS = `${formatTime(16, 30)} – ${formatTime(20, 30)}`;

export const CONSULTATION_HOURS_DISPLAY = {
  weekdays: `${EVENING_HOURS} (Evening consultation)`,
  saturday: EVENING_HOURS,
  sunday: 'Closed',
  festivalNotice:
    'On festivals and special occasions, clinic timings may change. Please call or WhatsApp reception to confirm before visiting.',
  urgentCare: '24/7 On-Call Obstetric & Emergency Support'
} as const;

const isWithinWindow = (nowMinutes: number, window: TimeWindow) =>
  nowMinutes >= toMinutes(window.start) && nowMinutes < toMinutes(window.end);

const generateSlotTimes = (windows: TimeWindow[], intervalMinutes = 45): string[] => {
  const slots: string[] = [];
  const minimumSlotMinutes = 30;

  for (const window of windows) {
    let cursor = toMinutes(window.start);
    const end = toMinutes(window.end);

    while (cursor <= end) {
      if (cursor + minimumSlotMinutes <= end) {
        const hour = Math.floor(cursor / 60);
        const minute = cursor % 60;
        slots.push(formatSlotTime(hour, minute));
      }
      cursor += intervalMinutes;
    }
  }

  return slots;
};

export const BOOKING_TIME_PREFERENCES = generateSlotTimes([EVENING_CONSULTATION]);

export const DOCTOR_TIME_SLOTS = {
  shilpa: ['04:30 PM', '05:15 PM', '06:00 PM', '06:45 PM', '07:30 PM'],
  sunil: ['04:30 PM', '05:15 PM', '06:00 PM', '06:45 PM']
} as const;

export const getConsultationTimingsFaqAnswer = () =>
  `Our regular clinic timings are Monday to Saturday: ${EVENING_HOURS} (evening consultation only; morning OPD is not offered at present). Sunday: ${CONSULTATION_HOURS_DISPLAY.sunday}. ${CONSULTATION_HOURS_DISPLAY.festivalNotice} To book, use the form on this site or message us on WhatsApp — reception will confirm your slot.`;

export const isClinicOpenNow = (date = new Date()): boolean => {
  const day = date.getDay();
  const nowMinutes = date.getHours() * 60 + date.getMinutes();

  if (day === 0) {
    return false;
  }

  if (day >= 1 && day <= 6) {
    return isWithinWindow(nowMinutes, EVENING_CONSULTATION);
  }

  return false;
};
