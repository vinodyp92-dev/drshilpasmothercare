import React, { useEffect, useState } from 'react';
import {
  Star,
  CheckCircle2,
  MessageSquare,
  Send,
  ThumbsUp,
  Heart,
  MapPin,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { PATIENT_REVIEWS_DATA } from '../data/clinicData';
import { PatientReview } from '../types/clinic';
import { useClinicConfig } from '../context/ClinicConfigContext';

const SLIDE_INTERVAL_MS = 5000;

export const ReviewsSection: React.FC = () => {
  const { config } = useClinicConfig();
  const [reviews, setReviews] = useState<PatientReview[]>(PATIENT_REVIEWS_DATA);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  const [name, setName] = useState('');
  const [doctorName, setDoctorName] = useState('Dr. Shilpa, MS (OBG)');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const total = reviews.length;

  const goTo = (index: number) => {
    if (total === 0) return;
    setActive(((index % total) + total) % total);
  };

  useEffect(() => {
    if (paused || total <= 1) return;
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const id = window.setInterval(() => {
      setActive((i) => (i + 1) % total);
    }, SLIDE_INTERVAL_MS);

    return () => window.clearInterval(id);
  }, [paused, total]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !comment) return;

    const newRev: PatientReview = {
      id: `rev-${Date.now()}`,
      patientName: name,
      doctorName,
      department: 'Mother & Child Speciality Care',
      rating,
      date: 'Just Now',
      comment,
      verified: true
    };

    setReviews([newRev, ...reviews]);
    setActive(0);
    setSubmitted(true);
    setTimeout(() => {
      setShowReviewForm(false);
      setSubmitted(false);
      setName('');
      setComment('');
    }, 2000);
  };

  const current = reviews[active];

  return (
    <section id="reviews" className="py-12 sm:py-16 bg-slate-50/50 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-pink-800 bg-pink-50 px-3.5 py-1 rounded-full border border-pink-200/80 inline-flex items-center gap-1.5">
            <Heart className="w-3.5 h-3.5 fill-pink-600 text-pink-600" />
            VERIFIED PATIENT TESTIMONIALS
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Stories from Happy Mothers & Families
          </h2>
          <p className="text-slate-600 text-sm leading-relaxed font-medium">
            Read real patient experiences from mothers and women who received care at {config.name}.
          </p>
        </div>

        <div className="p-4 sm:p-5 bg-white rounded-2xl border border-pink-200/90 shadow-sm max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="text-3xl font-black text-slate-900 font-mono">5.00</div>
            <div>
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                ))}
              </div>
              <span className="text-[11px] font-bold text-slate-500">Sample patient reviews</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2">
            <a
              href={config.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-all flex items-center gap-2 cursor-pointer border border-slate-200"
            >
              <MapPin className="w-3.5 h-3.5 text-pink-600" />
              View Google Reviews ↗
            </a>

            <button
              type="button"
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="px-4 py-2 bg-gradient-to-r from-pink-600 to-rose-500 hover:from-pink-700 hover:to-rose-600 text-white font-extrabold text-xs rounded-xl shadow-sm transition-all flex items-center gap-2 cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              Write Feedback
            </button>
          </div>
        </div>

        {showReviewForm && (
          <div className="p-5 bg-white rounded-2xl border border-pink-300 shadow-xl max-w-xl mx-auto space-y-4 animate-fade-in">
            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="text-sm font-extrabold text-slate-900 border-b border-pink-100 pb-2">
                  Share Your Experience with Dr. Shilpa
                </h3>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Your Name / Initials *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Radhika S., Tumakuru"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2.5 bg-pink-50/40 border border-pink-200 rounded-xl text-xs font-bold text-slate-800"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Attending Physician</label>
                  <select
                    value={doctorName}
                    onChange={(e) => setDoctorName(e.target.value)}
                    className="w-full p-2.5 bg-pink-50/40 border border-pink-200 rounded-xl text-xs font-bold text-slate-800"
                  >
                    <option value="Dr. Shilpa, MS (OBG)">Dr. Shilpa, MS (OBG) — Lead Obstetrician</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Rating</label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="text-amber-400 focus:outline-none cursor-pointer"
                      >
                        <Star className={`w-6 h-6 ${rating >= star ? 'fill-amber-400' : 'text-slate-200'}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Your Review *</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Share your experience during antenatal visits, delivery, or gynaecology consultation..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full p-2.5 bg-pink-50/40 border border-pink-200 rounded-xl text-xs font-bold text-slate-800"
                  />
                </div>

                <div className="flex gap-2 justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setShowReviewForm(false)}
                    className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-gradient-to-r from-pink-600 to-rose-500 hover:from-pink-700 hover:to-rose-600 text-white font-extrabold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" /> Submit Review
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-center py-6 space-y-2">
                <CheckCircle2 className="w-10 h-10 text-pink-600 mx-auto" />
                <h4 className="text-base font-extrabold text-slate-900">Thank You For Your Review!</h4>
                <p className="text-xs text-slate-600">Your feedback has been published.</p>
              </div>
            )}
          </div>
        )}

        {/* Moving review slideshow — one card at a time */}
        <div
          className="relative max-w-2xl mx-auto"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          aria-roledescription="carousel"
          aria-label="Patient review slideshow"
        >
          <div className="relative overflow-hidden rounded-2xl border border-pink-200/90 bg-white shadow-sm min-h-[200px]">
            {reviews.map((rev, index) => (
              <div
                key={rev.id}
                className={`px-5 py-5 sm:px-6 sm:py-6 transition-opacity duration-500 ease-out ${
                  index === active
                    ? 'relative opacity-100 z-[1]'
                    : 'absolute inset-0 opacity-0 z-0 pointer-events-none'
                }`}
                aria-hidden={index !== active}
              >
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-10 h-10 rounded-2xl bg-pink-100 text-pink-900 font-extrabold flex items-center justify-center text-xs border border-pink-200 flex-shrink-0">
                      {rev.patientName[0]}
                    </div>
                    <div className="min-w-0">
                      <span className="font-extrabold text-slate-900 text-sm block truncate">
                        {rev.patientName}
                      </span>
                      <span className="text-[11px] text-slate-500 font-medium truncate block">
                        {rev.doctorName} • {rev.department}
                      </span>
                    </div>
                  </div>

                  <span className="text-[10px] font-extrabold text-pink-900 bg-pink-50 px-2.5 py-0.5 rounded-full border border-pink-200 flex items-center gap-1 flex-shrink-0">
                    <CheckCircle2 className="w-3 h-3 text-pink-600" /> Verified
                  </span>
                </div>

                <div className="flex items-center gap-1 text-amber-400 mb-2.5">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                </div>

                <p className="text-sm text-slate-700 leading-relaxed font-medium">
                  &ldquo;{rev.comment}&rdquo;
                </p>

                <div className="pt-3 mt-3 border-t border-pink-50 text-[10px] text-slate-400 flex justify-between font-bold">
                  <span>Posted {rev.date}</span>
                  <span className="flex items-center gap-1 text-pink-700">
                    <ThumbsUp className="w-3 h-3" /> Helpful
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between gap-3 mt-3 px-1">
            <button
              type="button"
              onClick={() => goTo(active - 1)}
              className="p-2 rounded-full border border-pink-200 bg-white text-pink-800 hover:bg-pink-50 transition-colors cursor-pointer"
              aria-label="Previous review"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-1.5" role="tablist" aria-label="Review slides">
              {reviews.map((rev, index) => (
                <button
                  key={rev.id}
                  type="button"
                  role="tab"
                  aria-selected={index === active}
                  aria-label={`Show review ${index + 1} of ${total}${current && index === active ? `: ${current.patientName}` : ''}`}
                  onClick={() => goTo(index)}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    index === active
                      ? 'w-6 bg-pink-600'
                      : 'w-2 bg-pink-200 hover:bg-pink-300'
                  }`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={() => goTo(active + 1)}
              className="p-2 rounded-full border border-pink-200 bg-white text-pink-800 hover:bg-pink-50 transition-colors cursor-pointer"
              aria-label="Next review"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <p className="text-center text-[11px] text-slate-400 font-medium mt-2">
            {active + 1} / {total}
          </p>
        </div>
      </div>
    </section>
  );
};
