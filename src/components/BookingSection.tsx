import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  User,
  Phone,
  MessageCircle,
  Stethoscope,
  Send,
  ChevronRight,
  CheckCircle2
} from 'lucide-react';
import { DOCTORS_DATA, SERVICES_DATA } from '../data/clinicData';
import { useClinicConfig } from '../context/ClinicConfigContext';
import { buildBookingRequestMessage, openWhatsappChat } from '../utils/whatsapp';
import {
  availableTimesForDate,
  buildManageUrl,
  createBooking,
  fetchTakenSlots,
  normalizeTime,
  refreshBookingSyncStatus
} from '../utils/bookingApi';
import { ManageBookingPanel } from './ManageBookingPanel';
import { BOOKING_TIME_PREFERENCES } from '../utils/clinicHours';

interface BookingSectionProps {
  preselectedDoctorId?: string;
  preselectedServiceName?: string;
}

export const BookingSection: React.FC<BookingSectionProps> = ({
  preselectedDoctorId,
  preselectedServiceName
}) => {
  const { config } = useClinicConfig();
  const [syncEnabled, setSyncEnabled] = useState(false);

  const [selectedDoctorId, setSelectedDoctorId] = useState(
    preselectedDoctorId || DOCTORS_DATA[0].id
  );
  const [selectedService, setSelectedService] = useState(
    preselectedServiceName || SERVICES_DATA[0].name
  );
  const [preferredDate, setPreferredDate] = useState(
    new Date(Date.now() + 86400000).toISOString().split('T')[0]
  );
  const [preferredTime, setPreferredTime] = useState('04:30 PM');
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [reason, setReason] = useState('');
  const [patientType, setPatientType] = useState<'New Patient' | 'Returning Patient'>('New Patient');
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [takenSlots, setTakenSlots] = useState<string[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [syncWarning, setSyncWarning] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [lastBookingId, setLastBookingId] = useState<string | undefined>();
  const [lastManageUrl, setLastManageUrl] = useState<string | undefined>();

  const activeDoctor = DOCTORS_DATA.find((d) => d.id === selectedDoctorId) || DOCTORS_DATA[0];
  const takenSet = new Set(takenSlots.map(normalizeTime));
  const availableTimes = syncEnabled
    ? availableTimesForDate(BOOKING_TIME_PREFERENCES, takenSlots)
    : [...BOOKING_TIME_PREFERENCES];

  useEffect(() => {
    if (preselectedDoctorId) setSelectedDoctorId(preselectedDoctorId);
  }, [preselectedDoctorId]);

  useEffect(() => {
    if (preselectedServiceName) setSelectedService(preselectedServiceName);
  }, [preselectedServiceName]);

  useEffect(() => {
    let cancelled = false;
    refreshBookingSyncStatus().then((enabled) => {
      if (!cancelled) setSyncEnabled(enabled);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // Background slot sync — no-op when server booking proxy is not configured
  useEffect(() => {
    if (!syncEnabled) {
      setTakenSlots([]);
      return;
    }

    let cancelled = false;

    const load = async () => {
      setSlotsLoading(true);
      const { taken, error } = await fetchTakenSlots(preferredDate, selectedDoctorId);
      if (cancelled) return;
      setTakenSlots(taken);
      setSyncWarning(error || null);
      setSlotsLoading(false);
    };

    load();
    const timer = window.setInterval(load, 45000);
    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, [syncEnabled, preferredDate, selectedDoctorId]);

  useEffect(() => {
    if (!availableTimes.length) return;
    if (!availableTimes.includes(preferredTime)) {
      setPreferredTime(availableTimes[0]);
    }
  }, [availableTimes, preferredTime]);

  const messagePreview = buildBookingRequestMessage({
    clinicName: config.name,
    patientName: patientName || 'Your Name',
    patientPhone: patientPhone || 'Your Phone',
    preferredDate,
    preferredTime,
    doctorName: activeDoctor.name,
    service: selectedService,
    patientType,
    reason,
    bookingId: lastBookingId,
    manageUrl: lastManageUrl
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName.trim() || !patientPhone.trim() || !preferredDate) return;
    if (syncEnabled && availableTimes.length === 0) {
      setFormError('No free slots on this date. Please choose another day.');
      return;
    }

    setFormError(null);
    setSubmitting(true);

    let bookingId: string | undefined;
    let manageUrl: string | undefined;

    if (syncEnabled) {
      const result = await createBooking({
        patientName: patientName.trim(),
        phone: patientPhone.trim(),
        doctorId: activeDoctor.id,
        doctorName: activeDoctor.name,
        service: selectedService,
        date: preferredDate,
        time: preferredTime,
        patientType,
        reason: reason.trim()
      });

      if (!result.ok) {
        // Hard block only for real conflicts; otherwise keep WhatsApp booking working
        if (result.code === 'SLOT_TAKEN') {
          setSubmitting(false);
          setFormError('That time was just taken. Please pick another slot.');
          const { taken } = await fetchTakenSlots(preferredDate, selectedDoctorId);
          setTakenSlots(taken);
          return;
        }
        // Soft fallback: open WhatsApp without Sheet lock
        setFormError(
          result.error
            ? `${result.error} WhatsApp will still open so you can send the request.`
            : null
        );
        setLastBookingId(undefined);
        setLastManageUrl(undefined);
      } else {
        bookingId = result.booking.id;
        const token = result.booking.manageToken;
        if (token) {
          manageUrl = buildManageUrl(result.booking.id, token);
        }
        setLastBookingId(bookingId);
        setLastManageUrl(manageUrl);
        setTakenSlots((prev) => [...prev, preferredTime]);
      }
    }

    const message = buildBookingRequestMessage({
      clinicName: config.name,
      patientName: patientName.trim(),
      patientPhone: patientPhone.trim(),
      preferredDate,
      preferredTime,
      doctorName: activeDoctor.name,
      service: selectedService,
      patientType,
      reason,
      bookingId,
      manageUrl
    });

    openWhatsappChat(config.receptionistWhatsapp || config.mobile, message);
    setSubmitting(false);
    setSent(true);
  };

  return (
    <section id="booking" className="py-16 sm:py-24 bg-slate-50/70 border-y border-slate-200/70">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-3">
          <span className="section-eyebrow">
            <Calendar className="w-3.5 h-3.5 text-pink-600" />
            Book via WhatsApp
          </span>
          <h2 className="font-aesthetic text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight text-balance">
            Request an appointment
          </h2>
          <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto leading-relaxed">
            Fill in your details below. We will open WhatsApp with a ready message — send it to
            reception
            {syncEnabled ? '. Available times update automatically.' : ' and they will confirm your slot.'}
          </p>
        </div>

        {sent ? (
          <div className="bg-white rounded-3xl border border-emerald-200 p-8 text-center space-y-4 shadow-[var(--shadow-soft)] animate-fade-in">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-extrabold text-slate-900">
              {lastBookingId ? 'Slot reserved · WhatsApp opened' : 'WhatsApp opened'}
            </h3>
            <p className="text-sm text-slate-600 max-w-md mx-auto">
              {lastBookingId
                ? `Your booking ID is ${lastBookingId}. Send the pre-filled WhatsApp message so reception is notified. Use the link in the message to cancel or change time anytime.`
                : 'Send the pre-filled message to our reception desk. They will reply with your confirmed appointment time.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center pt-2">
              <button
                type="button"
                onClick={() => {
                  openWhatsappChat(
                    config.receptionistWhatsapp || config.mobile,
                    messagePreview
                  );
                }}
                className="btn-primary px-5 py-2.5 text-sm cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                Open WhatsApp again
              </button>
              <button
                type="button"
                onClick={() => {
                  setSent(false);
                  setLastBookingId(undefined);
                  setLastManageUrl(undefined);
                }}
                className="btn-secondary px-5 py-2.5 text-sm cursor-pointer"
              >
                Book another visit
              </button>
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 space-y-6 shadow-[var(--shadow-soft)]"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  <User className="w-3.5 h-3.5 inline mr-1 text-pink-600" />
                  Patient name *
                </label>
                <input
                  type="text"
                  required
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder="e.g. Radhika Sharma"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-pink-500"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  <Phone className="w-3.5 h-3.5 inline mr-1 text-pink-600" />
                  Mobile number *
                </label>
                <input
                  type="tel"
                  required
                  value={patientPhone}
                  onChange={(e) => setPatientPhone(e.target.value)}
                  placeholder="e.g. 98765 43210"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-pink-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  <Calendar className="w-3.5 h-3.5 inline mr-1 text-pink-600" />
                  Preferred date *
                </label>
                <input
                  type="date"
                  required
                  value={preferredDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-pink-500"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  <Clock className="w-3.5 h-3.5 inline mr-1 text-pink-600" />
                  Preferred time
                  {syncEnabled && slotsLoading ? (
                    <span className="ml-1 font-medium text-slate-400">· syncing…</span>
                  ) : null}
                </label>
                <select
                  value={preferredTime}
                  onChange={(e) => setPreferredTime(e.target.value)}
                  disabled={syncEnabled && availableTimes.length === 0}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-pink-500 disabled:opacity-60"
                >
                  {syncEnabled ? (
                    BOOKING_TIME_PREFERENCES.map((t) => {
                      const booked = takenSet.has(normalizeTime(t));
                      return (
                        <option key={t} value={t} disabled={booked}>
                          {booked ? `${t} — Booked` : t}
                        </option>
                      );
                    })
                  ) : (
                    BOOKING_TIME_PREFERENCES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))
                  )}
                </select>
                {syncEnabled && takenSlots.length > 0 && (
                  <p className="text-[10px] text-slate-500 mt-1">
                    Grayed times are already reserved for this doctor.
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  <Stethoscope className="w-3.5 h-3.5 inline mr-1 text-pink-600" />
                  Doctor
                </label>
                <select
                  value={selectedDoctorId}
                  onChange={(e) => setSelectedDoctorId(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-pink-500"
                >
                  {DOCTORS_DATA.map((doc) => (
                    <option key={doc.id} value={doc.id}>
                      {doc.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">Service</label>
                <select
                  value={selectedService}
                  onChange={(e) => setSelectedService(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-pink-500"
                >
                  {SERVICES_DATA.map((s) => (
                    <option key={s.id} value={s.name}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">Patient type</label>
              <div className="flex gap-2">
                {(['New Patient', 'Returning Patient'] as const).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setPatientType(type)}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                      patientType === type
                        ? 'bg-pink-600 text-white border-pink-600'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-pink-300'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">
                Reason for visit (optional)
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={2}
                placeholder="e.g. Antenatal checkup, irregular periods..."
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-pink-500 resize-none"
              />
            </div>

            {formError && (
              <p className="text-xs text-rose-600 font-medium text-center">{formError}</p>
            )}
            {syncWarning && !formError && (
              <p className="text-[11px] text-amber-800 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 leading-relaxed">
                Slot calendar not connected yet: {syncWarning}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting || (syncEnabled && availableTimes.length === 0)}
              className="btn-primary w-full py-3.5 text-sm cursor-pointer disabled:opacity-60"
            >
              <Send className="w-4 h-4" />
              {submitting
                ? 'Reserving slot…'
                : 'Send appointment request on WhatsApp'}
              <ChevronRight className="w-4 h-4" />
            </button>

            <p className="text-[11px] text-center text-slate-500">
              Reception: {config.receptionistWhatsapp || config.mobile}
              {syncEnabled
                ? ' · Slot locks automatically when you submit'
                : ' · Final slot confirmed by clinic staff'}
            </p>
          </form>
        )}

        <ManageBookingPanel />
      </div>
    </section>
  );
};
