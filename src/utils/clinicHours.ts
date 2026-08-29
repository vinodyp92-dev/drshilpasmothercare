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

const WEEKDAY_MORNING: TimeWindow = { start: { hour: 9, minute: 30 }, end: { hour: 13, minute: 30 } };
const WEEKDAY_EVENING: TimeWindow = { start: { hour: 17, minute: 0 }, end: { hour: 20, minute: 30 } };
const SUNDAY_SESSION: TimeWindow = { start: { hour: 10, minute: 0 }, end: { hour: 13, minute: 0 } };

export const CONSULTATION_HOURS_DISPLAY = {
  weekdaysMorning: `${formatTime(9, 30)} – ${formatTime(13, 30)}`,
  weekdaysEvening: `${formatTime(17, 0)} – ${formatTime(20, 30)}`,
  saturday: `${formatTime(9, 30)} – ${formatTime(13, 30)} & ${formatTime(17, 0)} – ${formatTime(20, 30)}`,
  sunday: `${formatTime(10, 0)} – ${formatTime(13, 0)} (Prior Appointment)`,
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

const WEEKDAY_WINDOWS = [WEEKDAY_MORNING, WEEKDAY_EVENING];

export const BOOKING_TIME_PREFERENCES = generateSlotTimes(WEEKDAY_WINDOWS);

export const DOCTOR_TIME_SLOTS = {
  shilpa: ['09:30 AM', '11:00 AM', '12:30 PM', '05:00 PM', '06:30 PM', '07:45 PM'],
  sunil: ['10:30 AM', '12:00 PM', '05:00 PM', '06:30 PM']
} as const;

export const getConsultationTimingsFaqAnswer = () =>
  `Our regular clinic timings are Monday to Saturday: Morning ${CONSULTATION_HOURS_DISPLAY.weekdaysMorning} & Evening ${CONSULTATION_HOURS_DISPLAY.weekdaysEvening}. Sunday: ${CONSULTATION_HOURS_DISPLAY.sunday}. To book, use the form on this site or message us on WhatsApp — reception will confirm your slot.`;

export const isClinicOpenNow = (date = new Date()): boolean => {
  const day = date.getDay();
  const nowMinutes = date.getHours() * 60 + date.getMinutes();

  if (day >= 1 && day <= 6) {
    return isWithinWindow(nowMinutes, WEEKDAY_MORNING) || isWithinWindow(nowMinutes, WEEKDAY_EVENING);
  }

  if (day === 0) {
    return isWithinWindow(nowMinutes, SUNDAY_SESSION);
  }

  return false;
};
