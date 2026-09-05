import React, { useEffect, useState } from 'react';
import { Calendar, Clock, Phone, RefreshCw, XCircle, CalendarClock } from 'lucide-react';
import {
  BOOKING_TIME_PREFERENCES,
  availableTimesForDate,
  cancelBooking,
  fetchTakenSlots,
  listBookingsByPhone,
  lookupBooking,
  normalizeTime,
  parseManageHash,
  refreshBookingSyncStatus,
  rescheduleBooking,
  type BookingRecord
} from '../utils/bookingApi';

type Step = 'find' | 'list' | 'reschedule' | 'cancel';

/**
 * Standard self-serve flow (phone → list → Reschedule / Cancel).
 * Deep link #manage=ID.TOKEN still supported from WhatsApp.
 */
export const ManageBookingPanel: React.FC = () => {
  const [enabled, setEnabled] = useState(false);
  const [step, setStep] = useState<Step>('find');
  const [phone, setPhone] = useState('');
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [booking, setBooking] = useState<BookingRecord | null>(null);
  const [manageToken, setManageToken] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [available, setAvailable] = useState<string[]>([...BOOKING_TIME_PREFERENCES]);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    refreshBookingSyncStatus().then((on) => {
      if (!cancelled) setEnabled(on);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // WhatsApp deep link: auto-load that booking
  useEffect(() => {
    if (!enabled) return;
    const applyHash = async () => {
      const parsed = parseManageHash(window.location.hash);
      if (!parsed) return;
      setBusy(true);
      setError(null);
      const result = await lookupBooking(parsed.id, parsed.token);
      setBusy(false);
      if (!result.ok) {
        setError(result.error || 'Could not open that booking link');
        return;
      }
      const token = result.booking.manageToken || parsed.token;
      setBooking({ ...result.booking, manageToken: token });
      setManageToken(token);
      setPhone(result.booking.phone || '');
      setNewDate(result.booking.date);
      setNewTime(result.booking.time);
      setBookings([{ ...result.booking, manageToken: token }]);
      setStep('list');
    };
    applyHash();
    window.addEventListener('hashchange', applyHash);
    return () => window.removeEventListener('hashchange', applyHash);
  }, [enabled]);

  useEffect(() => {
    if (!enabled || !booking || step !== 'reschedule' || !newDate) return;
    let cancelled = false;
    (async () => {
      const { taken } = await fetchTakenSlots(newDate, booking.doctorId);
      if (cancelled) return;
      const takenExceptSelf =
        newDate === booking.date
          ? taken.filter((t) => normalizeTime(t) !== normalizeTime(booking.time))
          : taken;
      const free = availableTimesForDate(BOOKING_TIME_PREFERENCES, takenExceptSelf);
      setAvailable(free);
      setNewTime((prev) => (free.includes(prev) ? prev : free[0] || ''));
    })();
    return () => {
      cancelled = true;
    };
  }, [enabled, booking, newDate, step]);

  if (!enabled) return null;

  const handleFind = async () => {
    setError(null);
    setMessage(null);
    const digits = phone.replace(/\D/g, '');
    if (digits.length < 10) {
      setError('Enter the 10-digit mobile number used while booking.');
      return;
    }
    setBusy(true);
    const result = await listBookingsByPhone(phone.trim());
    setBusy(false);
    if (!result.ok) {
      setBookings([]);
      setBooking(null);
      setError(result.error || 'Could not find appointments');
      return;
    }
    const list = result.bookings || [];
    setBookings(list);
    if (list.length === 0) {
      setError(
        'No active appointments for this number. If you just booked, the Sheet may not have saved — try booking again and confirm a Booking ID appears.'
      );
      setStep('find');
      return;
    }
    setStep('list');
    if (list.length === 1) {
      setBooking(list[0]);
      setManageToken(list[0].manageToken || '');
      setNewDate(list[0].date);
      setNewTime(list[0].time);
    }
  };

  const selectBooking = (b: BookingRecord) => {
    setBooking(b);
    setManageToken(b.manageToken || '');
    setNewDate(b.date);
    setNewTime(b.time);
    setError(null);
    setMessage(null);
  };

  const handleCancel = async () => {
    if (!booking) return;
    const token = manageToken || booking.manageToken || '';
    setError(null);
    setMessage(null);
    setBusy(true);
    const result = await cancelBooking(booking.id, token, phone.trim() || booking.phone);
    setBusy(false);
    if (!result.ok) {
      setError(result.error || 'Cancel failed');
      return;
    }
    setMessage('Appointment cancelled. That slot is free again.');
    setBookings((prev) => prev.filter((b) => b.id !== booking.id));
    setBooking(null);
    setStep('list');
  };

  const handleReschedule = async () => {
    if (!booking || !newDate || !newTime) return;
    const token = manageToken || booking.manageToken || '';
    setError(null);
    setMessage(null);
    setBusy(true);
    const result = await rescheduleBooking(
      booking.id,
      token,
      phone.trim() || booking.phone,
      newDate,
      newTime
    );
    setBusy(false);
    if (!result.ok) {
      setError(
        result.code === 'SLOT_TAKEN'
          ? 'That time was just taken. Pick another slot.'
          : result.error || 'Could not reschedule'
      );
      return;
    }
    const updated = {
      ...result.booking,
      manageToken: token
    };
    setBooking(updated);
    setBookings((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
    setMessage(`Rescheduled to ${updated.date} at ${updated.time}.`);
    setStep('list');
  };

  return (
    <div
      id="manage-booking"
      className="rounded-3xl border border-pink-200/80 bg-white p-5 sm:p-6 shadow-[var(--shadow-soft)] space-y-4"
    >
      <div>
        <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
          Manage your appointment
        </h3>
        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
          Enter the mobile number you used to book. Then cancel or pick a new time — no booking
          code needed.
        </p>
      </div>

      {step === 'find' && (
        <div className="space-y-3">
          <label className="text-xs font-bold text-slate-700 block">
            <Phone className="w-3.5 h-3.5 inline mr-1 text-pink-600" />
            Mobile number
          </label>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. 98765 43210"
              className="flex-1 w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-pink-500"
            />
            <button
              type="button"
              disabled={busy}
              onClick={handleFind}
              className="btn-primary px-5 py-3 text-xs cursor-pointer disabled:opacity-50 shrink-0"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${busy ? 'animate-spin' : ''}`} />
              Find appointments
            </button>
          </div>
        </div>
      )}

      {error && <p className="text-xs text-rose-600 font-medium">{error}</p>}
      {message && <p className="text-xs text-emerald-700 font-medium">{message}</p>}

      {step === 'list' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-semibold text-slate-700">
              {bookings.length} active appointment{bookings.length === 1 ? '' : 's'}
            </p>
            <button
              type="button"
              onClick={() => {
                setStep('find');
                setBookings([]);
                setBooking(null);
                setError(null);
                setMessage(null);
              }}
              className="text-[11px] font-bold text-pink-700 hover:underline cursor-pointer"
            >
              Use another number
            </button>
          </div>

          {bookings.length === 0 ? (
            <p className="text-xs text-slate-500">No active appointments left for this number.</p>
          ) : (
            <ul className="space-y-2">
              {bookings.map((b) => {
                const selected = booking?.id === b.id;
                return (
                  <li
                    key={b.id}
                    className={`rounded-2xl border p-3 space-y-3 transition-colors ${
                      selected
                        ? 'border-pink-300 bg-pink-50/60'
                        : 'border-slate-200 bg-slate-50'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => selectBooking(b)}
                      className="w-full text-left cursor-pointer"
                    >
                      <p className="text-sm font-bold text-slate-900">
                        {b.date} · {b.time}
                      </p>
                      <p className="text-[11px] text-slate-600 mt-0.5">
                        {b.doctorName} · {b.service}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        ID {b.id} · {b.status}
                      </p>
                    </button>

                    {selected && b.status !== 'cancelled' && (
                      <div className="flex flex-col sm:flex-row gap-2 pt-1 border-t border-pink-100">
                        <button
                          type="button"
                          onClick={() => {
                            setStep('reschedule');
                            setError(null);
                            setMessage(null);
                          }}
                          className="btn-primary flex-1 py-2.5 text-xs cursor-pointer"
                        >
                          <CalendarClock className="w-3.5 h-3.5" />
                          Reschedule
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setStep('cancel');
                            setError(null);
                            setMessage(null);
                          }}
                          className="inline-flex flex-1 items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-bold rounded-xl border border-rose-200 text-rose-700 bg-rose-50 hover:bg-rose-100 cursor-pointer"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          Cancel
                        </button>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
          {bookings.length > 1 && !booking && (
            <p className="text-[11px] text-slate-500">Tap an appointment to manage it.</p>
          )}
        </div>
      )}

      {step === 'reschedule' && booking && (
        <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4 space-y-3">
          <p className="text-xs font-bold text-slate-900">
            Reschedule · currently {booking.date} at {booking.time}
          </p>
          <p className="text-[11px] text-slate-600">
            Pick any free slot. A later time postpones; an earlier time prepones.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] font-bold text-slate-600 block mb-1">
                <Calendar className="w-3 h-3 inline mr-1" />
                New date
              </label>
              <input
                type="date"
                value={newDate}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setNewDate(e.target.value)}
                className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-600 block mb-1">
                <Clock className="w-3 h-3 inline mr-1" />
                New time
              </label>
              <select
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-sm"
              >
                {available.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              type="button"
              disabled={busy || !newDate || !newTime}
              onClick={handleReschedule}
              className="btn-primary px-4 py-2.5 text-xs cursor-pointer disabled:opacity-50"
            >
              Confirm new time
            </button>
            <button
              type="button"
              onClick={() => setStep('list')}
              className="btn-secondary px-4 py-2.5 text-xs cursor-pointer"
            >
              Back
            </button>
          </div>
        </div>
      )}

      {step === 'cancel' && booking && (
        <div className="rounded-2xl bg-rose-50 border border-rose-200 p-4 space-y-3">
          <p className="text-xs font-bold text-rose-900">
            Cancel {booking.date} at {booking.time}?
          </p>
          <p className="text-[11px] text-rose-800">
            This frees the slot for other patients. You can book again anytime.
          </p>
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              type="button"
              disabled={busy}
              onClick={handleCancel}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-bold rounded-xl border border-rose-300 text-white bg-rose-600 hover:bg-rose-700 cursor-pointer disabled:opacity-50"
            >
              <XCircle className="w-3.5 h-3.5" />
              Yes, cancel
            </button>
            <button
              type="button"
              onClick={() => setStep('list')}
              className="btn-secondary px-4 py-2.5 text-xs cursor-pointer"
            >
              Keep appointment
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
