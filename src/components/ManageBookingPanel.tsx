import React, { useEffect, useState } from 'react';
import {
  Calendar,
  Clock,
  Phone,
  RefreshCw,
  XCircle,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';
import {
  BOOKING_TIME_PREFERENCES,
  availableTimesForDate,
  cancelBooking,
  fetchTakenSlots,
  lookupBooking,
  normalizeTime,
  parseManageHash,
  refreshBookingSyncStatus,
  rescheduleBooking,
  type BookingRecord
} from '../utils/bookingApi';

type ManageMode = 'menu' | 'reschedule' | 'cancel';

/**
 * Self-serve cancel / postpone / prepone.
 * Opened via #manage=BOOKINGID.TOKEN from WhatsApp, or manually below the booking form.
 */
export const ManageBookingPanel: React.FC = () => {
  const [enabled, setEnabled] = useState(false);
  const [bookingId, setBookingId] = useState('');
  const [manageToken, setManageToken] = useState('');
  const [phone, setPhone] = useState('');
  const [booking, setBooking] = useState<BookingRecord | null>(null);
  const [mode, setMode] = useState<ManageMode>('menu');
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

  useEffect(() => {
    if (!enabled) return;
    const applyHash = () => {
      const parsed = parseManageHash(window.location.hash);
      if (parsed) {
        setBookingId(parsed.id);
        setManageToken(parsed.token);
      }
    };
    applyHash();
    window.addEventListener('hashchange', applyHash);
    return () => window.removeEventListener('hashchange', applyHash);
  }, [enabled]);

  useEffect(() => {
    if (!enabled || !booking || !newDate || mode !== 'reschedule') return;
    let cancelled = false;
    (async () => {
      const { taken } = await fetchTakenSlots(newDate, booking.doctorId);
      if (cancelled) return;
      const takenExceptSelf =
        newDate === booking.date
          ? taken.filter(
              (t) =>
                normalizeTime(t) !== normalizeTime(booking.time)
            )
          : taken;
      const free = availableTimesForDate(BOOKING_TIME_PREFERENCES, takenExceptSelf);
      setAvailable(free);
      setNewTime((prev) => (free.includes(prev) ? prev : free[0] || ''));
    })();
    return () => {
      cancelled = true;
    };
  }, [enabled, booking, newDate, mode]);

  if (!enabled) return null;

  const handleLookup = async () => {
    setError(null);
    setMessage(null);
    setBusy(true);
    const result = await lookupBooking(bookingId.trim(), manageToken.trim(), phone.trim());
    setBusy(false);
    if (!result.ok) {
      setBooking(null);
      setError(result.error || 'Could not find booking');
      return;
    }
    setBooking(result.booking);
    setNewDate(result.booking.date);
    setNewTime(result.booking.time);
    setMode('menu');
  };

  const handleCancel = async () => {
    if (!booking) return;
    setError(null);
    setMessage(null);
    setBusy(true);
    const result = await cancelBooking(booking.id, manageToken.trim(), phone.trim());
    setBusy(false);
    if (!result.ok) {
      setError(result.error || 'Cancel failed');
      return;
    }
    setBooking(result.booking);
    setMode('menu');
    setMessage('Appointment cancelled. That slot is free again for others.');
  };

  const handleReschedule = async () => {
    if (!booking || !newDate || !newTime) return;
    setError(null);
    setMessage(null);
    setBusy(true);
    const result = await rescheduleBooking(
      booking.id,
      manageToken.trim(),
      phone.trim(),
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
    setBooking(result.booking);
    setMode('menu');
    setMessage(`Updated to ${result.booking.date} at ${result.booking.time}.`);
  };
  return (
    <div
      id="manage-booking"
      className="rounded-3xl border border-pink-200/80 bg-white p-5 sm:p-6 shadow-[var(--shadow-soft)] space-y-4"
    >
      <div>
        <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
          Cancel · Postpone · Prepone
        </h3>
        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
          Already booked? Find your appointment with the Booking ID and manage code from your
          WhatsApp confirmation, then choose an action.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        <input
          type="text"
          value={bookingId}
          onChange={(e) => setBookingId(e.target.value.toUpperCase())}
          placeholder="Booking ID"
          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-pink-500"
        />
        <input
          type="text"
          value={manageToken}
          onChange={(e) => setManageToken(e.target.value)}
          placeholder="Manage code"
          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-pink-500"
        />
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Mobile used at booking"
          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-pink-500"
        />
      </div>

      <button
        type="button"
        disabled={busy || !bookingId || !manageToken}
        onClick={handleLookup}
        className="btn-secondary px-4 py-2 text-xs cursor-pointer disabled:opacity-50"
      >
        <RefreshCw className={`w-3.5 h-3.5 ${busy ? 'animate-spin' : ''}`} />
        Find appointment
      </button>

      {error && <p className="text-xs text-rose-600 font-medium">{error}</p>}
      {message && <p className="text-xs text-emerald-700 font-medium">{message}</p>}

      {booking && (
        <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4 space-y-4">
          <div className="text-xs text-slate-700 space-y-1">
            <p className="font-bold text-slate-900">
              {booking.patientName} · {booking.id} · {booking.status}
            </p>
            <p>
              {booking.date} · {booking.time}
            </p>
            <p>
              {booking.doctorName} · {booking.service}
            </p>
          </div>

          {booking.status !== 'cancelled' && mode === 'menu' && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => {
                  setMode('reschedule');
                  setMessage(null);
                  setError(null);
                }}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-bold rounded-xl border border-pink-200 text-pink-800 bg-pink-50 hover:bg-pink-100 cursor-pointer"
              >
                <ArrowRight className="w-3.5 h-3.5" />
                Postpone
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('reschedule');
                  setMessage(null);
                  setError(null);
                }}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-bold rounded-xl border border-violet-200 text-violet-800 bg-violet-50 hover:bg-violet-100 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Prepone
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('cancel');
                  setMessage(null);
                  setError(null);
                }}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-bold rounded-xl border border-rose-200 text-rose-700 bg-rose-50 hover:bg-rose-100 cursor-pointer"
              >
                <XCircle className="w-3.5 h-3.5" />
                Cancel
              </button>
            </div>
          )}

          {booking.status !== 'cancelled' && mode === 'reschedule' && (
            <div className="space-y-3">
              <p className="text-[11px] text-slate-600">
                Pick a new date and time. Choosing a later slot postpones; an earlier slot
                prepones.
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
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg text-sm"
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
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg text-sm"
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
                  className="btn-primary px-4 py-2 text-xs cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Confirm new time
                </button>
                <button
                  type="button"
                  onClick={() => setMode('menu')}
                  className="btn-secondary px-4 py-2 text-xs cursor-pointer"
                >
                  Back
                </button>
              </div>
            </div>
          )}

          {booking.status !== 'cancelled' && mode === 'cancel' && (
            <div className="space-y-3">
              <p className="text-[11px] text-rose-700">
                This will cancel your appointment and free the slot for other patients.
              </p>
              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  type="button"
                  disabled={busy}
                  onClick={handleCancel}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl border border-rose-200 text-rose-700 bg-rose-50 hover:bg-rose-100 cursor-pointer disabled:opacity-50"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  Yes, cancel appointment
                </button>
                <button
                  type="button"
                  onClick={() => setMode('menu')}
                  className="btn-secondary px-4 py-2 text-xs cursor-pointer"
                >
                  Back
                </button>
              </div>
            </div>
          )}

          <p className="text-[10px] text-slate-500 flex items-center gap-1">
            <Phone className="w-3 h-3" />
            Mobile must match the number used when booking.
          </p>
        </div>
      )}
    </div>
  );
};
