import type { ClinicConfig } from '../context/ClinicConfigContext';
import { getConsultationTimingsFaqAnswer } from './clinicHours';

const STATIC_FAQS = [
  {
    question: 'Are ultrasound scan facilities available on-site?',
    answer:
      'Yes! We have advanced ultrasound scan equipment for antenatal growth scans, anomaly scans, follicular monitoring, and pelvic ultrasound evaluation.'
  },
  {
    question: 'Do you offer emergency obstetric care?',
    answer:
      'Yes, 24/7 emergency phone triage and emergency delivery support are available for registered mothers.'
  }
] as const;

export function getClinicFaqs(config: ClinicConfig) {
  return [
    {
      question: 'How do I book an appointment with Dr. Shilpa?',
      answer: `Fill in your name, phone, and preferred date in the booking form on this site — it opens WhatsApp with your details ready to send. Reception will confirm your slot. You can also call or WhatsApp us at ${config.phone} / ${config.mobile} / ${config.mobileAlt}.`
    },
    {
      question: 'What are the clinic consultation timings?',
      answer: getConsultationTimingsFaqAnswer()
    },
    {
      question: 'Where is the clinic located in Tumakuru?',
      answer: `${config.name} is located on ${config.address}, ${config.landmark}, ${config.cityStatePincode}.`
    },
    ...STATIC_FAQS
  ];
}
