/**
 * Local unit checks for slot time normalization / availability filtering.
 * Run: node scripts/test-booking-time.mjs
 */

function normalizeTime(t) {
  const raw = String(t || '')
    .replace(/\s+/g, ' ')
    .trim()
    .toUpperCase();
  const m12 = raw.match(/^(\d{1,2}):(\d{2})(?::\d{2})?\s*(AM|PM)$/);
  if (m12) {
    const hour12 = parseInt(m12[1], 10) % 12 || 12;
    return `${String(hour12).padStart(2, '0')}:${m12[2]} ${m12[3]}`;
  }
  const m24 = raw.match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);
  if (m24) {
    const hour24 = parseInt(m24[1], 10);
    const minute = m24[2];
    const period = hour24 >= 12 ? 'PM' : 'AM';
    const hour12 = hour24 % 12 || 12;
    return `${String(hour12).padStart(2, '0')}:${minute} ${period}`;
  }
  return raw;
}

function availableTimesForDate(allTimes, taken) {
  const takenSet = new Set(taken.map(normalizeTime));
  return allTimes.filter((t) => !takenSet.has(normalizeTime(t)));
}

let failed = 0;
function assert(name, cond) {
  if (!cond) {
    failed += 1;
    console.error('FAIL:', name);
  } else {
    console.log('OK:', name);
  }
}

assert('pad 4:30 PM', normalizeTime('4:30 PM') === '04:30 PM');
assert('keep 04:30 PM', normalizeTime('04:30 PM') === '04:30 PM');
assert('24h 16:30', normalizeTime('16:30') === '04:30 PM');
assert('24h 16:30:00', normalizeTime('16:30:00') === '04:30 PM');
assert('lowercase am/pm', normalizeTime('5:00 pm') === '05:00 PM');

const slots = ['04:30 PM', '04:45 PM', '05:00 PM', '05:15 PM'];
const free = availableTimesForDate(slots, ['4:30 PM', '16:45']);
assert('filters 04:30', !free.includes('04:30 PM'));
assert('filters 04:45 via 16:45', !free.includes('04:45 PM'));
assert('keeps 05:00', free.includes('05:00 PM'));
assert('keeps 05:15', free.includes('05:15 PM'));

if (failed) {
  console.error(`\n${failed} test(s) failed`);
  process.exit(1);
}
console.log('\nAll booking time tests passed');
