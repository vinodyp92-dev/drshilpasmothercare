import { Doctor, MedicalService, InsuranceProvider, PatientReview } from '../types/clinic';
import drShilpaImg from '../assets/images/dr_shilpa_official_1786535230073.jpg';
import {
  CONSULTATION_HOURS_DISPLAY,
  DOCTOR_TIME_SLOTS,
  getConsultationTimingsFaqAnswer
} from '../utils/clinicHours';

export const CLINIC_INFO = {
  name: "Dr. Shilpa's Mother Care Speciality Clinic",
  tagline: 'Specialized Maternity, Obstetrics, Gynaecology & Infertility Care',
  address: 'Shettihalli Main Rd, Dasappa Garden, Tumakuru, Karnataka 572102',
  landmark: 'Near Dasappa Garden Junction',
  phone: '0816 225 8890',
  mobile: '+91 98450 12345',
  emergencyHotline: '+91 98450 99999 / 108 Emergency',
  email: 'care@drshilpamothercare.in',
  hours: {
    weekdays: CONSULTATION_HOURS_DISPLAY.weekdays,
    saturday: CONSULTATION_HOURS_DISPLAY.saturday,
    sunday: CONSULTATION_HOURS_DISPLAY.sunday,
    urgentCare: CONSULTATION_HOURS_DISPLAY.urgentCare
  },
  accreditation: [
    'Board Certified Obstetrician & Gynaecologist',
    'Advanced Fetal Ultrasound & Scan Center',
    'Infertility & Reproductive Care Specialist',
    'Premier Mother Care Specialist Facility in Tumakuru'
  ]
};

export const DOCTORS_DATA: Doctor[] = [
  {
    id: 'doc-shilpa',
    name: 'Dr. Shilpa Rani G R, MBBS, MS (OBG), FRM',
    title: 'Chief Obstetrician, Gynecologist & Infertility Specialist',
    department: 'Women\'s Health & OB/GYN',
    qualification: 'MBBS, MS in Obstetrics & Gynaecology',
    experienceYears: 16,
    rating: 4.98,
    reviewCount: 250,
    languages: ['Kannada', 'English', 'Hindi'],
    imageUrl: drShilpaImg,
    bio: 'Dr. Shilpa is a renowned Obstetrician and Gynecologist with over 16 years of expertise in high-risk pregnancies, infertility treatments, laparoscopic procedures, and holistic women health care. Founder of Mother Care Speciality Clinic in Tumakuru.',
    specialties: ['High Risk Pregnancy Management', 'Infertility Evaluation & IUI', 'Antenatal & Postnatal Care', 'PCOS & Hormonal Care', 'Laparoscopic Gynaecology'],
    consultationFee: 400,
    availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    timeSlots: [...DOCTOR_TIME_SLOTS.shilpa],
    acceptingNewPatients: true,
    education: 'MS (OBG) Bangalore Medical College, MBBS Mysore Medical College',
    location: 'Mother Care Speciality Clinic - Main Consultation Suite'
  },
  {
    id: 'doc-sunil',
    name: 'Dr. Sunil Kumar C A, MBBS, MD',
    title: 'Family Physician',
    department: 'General Medicine & Primary Care',
    qualification: 'MBBS, MD (General Medicine)',
    experienceYears: 14,
    rating: 4.95,
    reviewCount: 310,
    languages: ['Kannada', 'English', 'Telugu'],
    imageUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=600',
    bio: 'Experienced family physician providing primary care, chronic disease management, preventive health checkups, and coordinated care for mothers and families at the clinic.',
    specialties: ['Primary Care Consultations', 'Hypertension & Diabetes Care', 'Preventive Health Screening', 'Family Wellness'],
    consultationFee: 350,
    availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    timeSlots: [...DOCTOR_TIME_SLOTS.sunil],
    acceptingNewPatients: true,
    education: 'MD General Medicine KIMS, MBBS Bangalore Medical College',
    location: 'Primary Care Suite - Room 2'
  }
];

export const SERVICES_DATA: MedicalService[] = [
  {
    id: 'serv-1',
    name: 'Pre-Pregnancy Counseling',
    department: 'Women\'s Health & OB/GYN',
    iconName: 'HeartHandshake',
    shortDescription: 'Pre-conception checkups, genetic health evaluation, nutrition guidance, and reproductive readiness before planning a baby.',
    fullDescription: 'Preparing for a healthy pregnancy begins before conception. Our Pre-Pregnancy Counseling includes maternal health screening, rubella immunity test, thyroid evaluation, folic acid supplementation planning, and lifestyle optimization for both partners.',
    commonConditions: ['Conception Planning', 'Recurrent Miscarriage History', 'Thyroid Imbalance', 'Maternal Health Readiness'],
    procedures: ['Blood Pressure & Sugar Check', 'Torch & Viral Profile', 'Nutritional Assessment', 'Folic Acid Prescription'],
    durationMinutes: 30,
    priceEstimate: '₹400 Consultation',
    isTelehealthAvailable: true
  },
  {
    id: 'serv-2',
    name: 'Antenatal Checkup',
    department: 'Women\'s Health & OB/GYN',
    iconName: 'Baby',
    shortDescription: 'Comprehensive prenatal care, monthly checkups, fetal heartbeat monitoring, and maternal nutrition through all 3 trimesters.',
    fullDescription: 'Regular antenatal checkups ensure the safety of both mother and baby. Routine visits include blood pressure monitoring, weight tracking, fundal height measurement, fetal Doppler heartbeat listening, and timely blood test panels.',
    commonConditions: ['Routine Trimester Care', 'Morning Sickness', 'Anemia in Pregnancy', 'Fetal Weight Monitoring'],
    procedures: ['Obstetric Physical Exam', 'Fetal Doppler Heartbeat Scan', 'Complete Blood Count (CBC)', 'Glucose Tolerance Test'],
    durationMinutes: 25,
    priceEstimate: '₹400 Routine Visit',
    isTelehealthAvailable: true
  },
  {
    id: 'serv-3',
    name: 'High Risk Pregnancy',
    department: 'Women\'s Health & OB/GYN',
    iconName: 'AlertTriangle',
    shortDescription: 'Specialized intensive maternal-fetal care for gestational diabetes, preeclampsia, twin pregnancies, and previous losses.',
    fullDescription: 'Advanced obstetric supervision for pregnancies with medical complexities. Dr. Shilpa provides individualized care protocols for mothers with high blood pressure, gestational diabetes, thyroid issues, placenta previa, or twin gestations.',
    commonConditions: ['Preeclampsia / High BP', 'Gestational Diabetes Mellitus (GDM)', 'Twin / Multiple Pregnancy', 'Advanced Maternal Age (35+)'],
    procedures: ['Uterine Artery Doppler Scan', 'Non-Stress Test (NST)', 'Frequent Fetal Growth Monitoring', 'Emergency Triage Protocol'],
    durationMinutes: 40,
    priceEstimate: '₹500 Specialized Visit',
    isTelehealthAvailable: false
  },
  {
    id: 'serv-4',
    name: 'Infertility Treatment',
    department: 'Women\'s Health & OB/GYN',
    iconName: 'Sparkles',
    shortDescription: 'Comprehensive fertility evaluation, follicular monitoring, hormonal profiling, and Intrauterine Insemination (IUI) guidance.',
    fullDescription: 'Compassionate and scientific fertility support for couples trying to conceive. Includes ovulation tracking via high-resolution ultrasound, tubal patency tests (HSG), semen analysis review, hormonal balancing, and IUI treatments.',
    commonConditions: ['Anovulatory Infertility', 'Unexplained Infertility', 'Low Ovarian Reserve', 'Male Factor Subfertility'],
    procedures: ['Follicular Monitoring Scan', 'Hormonal Assay (AMH, FSH, LH)', 'Ovulation Induction', 'Intrauterine Insemination (IUI)'],
    durationMinutes: 35,
    priceEstimate: '₹400 - ₹1200 depending on scan series',
    isTelehealthAvailable: true
  },
  {
    id: 'serv-5',
    name: 'PCOS Management',
    department: 'Women\'s Health & OB/GYN',
    iconName: 'Activity',
    shortDescription: 'Polycystic Ovary Syndrome management focusing on cycle regularity, weight regulation, acne control, and fertility enhancement.',
    fullDescription: 'PCOS affects 1 in 5 women. Our holistic PCOS protocol combines ultrasound diagnosis, hormonal profiling, custom dietary plans, insulin-sensitizing medication, and ovulation restoration.',
    commonConditions: ['Polycystic Ovarian Disease (PCOS)', 'Irregular Periods', 'Hirsutism / Facial Hair', 'Weight Gain & Insulin Resistance'],
    procedures: ['Pelvic Ultrasound Scan', 'Insulin & Lipid Panel', 'Custom Dietary Roadmap', 'Ovulation Restoration Therapy'],
    durationMinutes: 30,
    priceEstimate: '₹400',
    isTelehealthAvailable: true
  },
  {
    id: 'serv-6',
    name: 'Irregular Periods & Hormonal Issues',
    department: 'Women\'s Health & OB/GYN',
    iconName: 'CalendarClock',
    shortDescription: 'Root-cause diagnosis and treatment for painful periods (dysmenorrhea), heavy menstrual bleeding, and thyroid imbalances.',
    fullDescription: 'Menstrual health is a key indicator of overall wellness. We provide thorough clinical workups for heavy bleeding (menorrhagia), infrequent periods (oligomenorrhea), painful cramps, and hormonal fluctuations.',
    commonConditions: ['Heavy Menstrual Bleeding', 'Severe Menstrual Cramps', 'Thyroid Menstrual Dysfunction', 'Progesterone Deficiency'],
    procedures: ['Transvaginal Ultrasound', 'Thyroid Profile (T3, T4, TSH)', 'Hormonal Panel', 'Medical Cycle Regulation'],
    durationMinutes: 25,
    priceEstimate: '₹400',
    isTelehealthAvailable: true
  },
  {
    id: 'serv-7',
    name: 'Menopause Care',
    department: 'Women\'s Health & OB/GYN',
    iconName: 'Sun',
    shortDescription: 'Perimenopause and post-menopause wellness, hot flash relief, bone density preservation, and hormone therapy consultation.',
    fullDescription: 'Guiding women through a smooth menopausal transition with evidence-based medical care, bone health evaluation, cardiovascular protection, and mood/sleep support.',
    commonConditions: ['Perimenopausal Hot Flashes', 'Post-Menopausal Osteoporosis', 'Vaginal Dryness', 'Sleep Disturbances'],
    procedures: ['Bone Mineral Density (DEXA) Referral', 'Lipid & Cardiac Marker Screening', 'Hormone Replacement Therapy (HRT)', 'Calcium & Vitamin D Therapy'],
    durationMinutes: 30,
    priceEstimate: '₹400',
    isTelehealthAvailable: true
  },
  {
    id: 'serv-8',
    name: 'Adolescent Gynaecology',
    department: 'Women\'s Health & OB/GYN',
    iconName: 'UserCheck',
    shortDescription: 'Pubertal health guidance, painful period management, teenage menstrual hygiene education, and HPV vaccination.',
    fullDescription: 'Gentle, confidential, and supportive gynaecological care for young girls and teenagers. We help navigate puberty changes, severe menstrual cramps, irregular cycles, and cervical cancer prevention vaccines.',
    commonConditions: ['Pubertal Delayed/Early Cycles', 'Teen Dysmenorrhea', 'Adolescent PCOS', 'Menstrual Hygiene Awareness'],
    procedures: ['Non-Invasive Abdominal Scan', 'Gentle Consultation', 'HPV Vaccine Administration', 'Nutritional Support'],
    durationMinutes: 25,
    priceEstimate: '₹400',
    isTelehealthAvailable: true
  },
  {
    id: 'serv-9',
    name: 'Pap Smear / Cervical Cancer Screening',
    department: 'Women\'s Health & OB/GYN',
    iconName: 'ShieldCheck',
    shortDescription: 'Routine Pap test, HPV DNA screening, liquid-based cytology, and preventive cervical cancer wellness exams.',
    fullDescription: 'Cervical cancer is largely preventable with regular screening. We conduct quick, painless Pap smear exams and HPV tests for early detection of pre-cancerous cellular changes.',
    commonConditions: ['Cervical Preventive Screening', 'Abnormal Vaginal Discharge', 'Post-Coital Bleeding', 'HPV Risk Check'],
    procedures: ['Liquid-Based Cytology Pap Test', 'High-Risk HPV DNA Test', 'Pelvic Bimanual Exam', 'Colposcopy Referral'],
    durationMinutes: 20,
    priceEstimate: '₹600 - ₹1200 including lab panel',
    isTelehealthAvailable: false
  },
  {
    id: 'serv-10',
    name: 'Family Planning & Contraception',
    department: 'Women\'s Health & OB/GYN',
    iconName: 'Users',
    shortDescription: 'Cu-T / Intrauterine Device (IUD) insertion, oral contraceptive pill guidance, barrier methods, and post-partum birth control.',
    fullDescription: 'Unbiased, confidential advice on reproductive choices. Services include Copper-T / Mirena IUD insertion, emergency contraception counseling, oral contraceptive prescriptions, and tubal ligation guidance.',
    commonConditions: ['Post-partum Birth Control', 'Inter-Pregnancy Spacing', 'IUD Placement & Removal', 'Oral Contraceptive Consultation'],
    procedures: ['Intrauterine Device (IUD / Cu-T) Fitting', 'Contraceptive Prescription', 'Pre-Procedural Ultrasound Check'],
    durationMinutes: 25,
    priceEstimate: '₹400 + procedure charges',
    isTelehealthAvailable: true
  },
  {
    id: 'serv-11',
    name: 'Fibroids / Ovarian Cysts / Endometriosis Treatment',
    department: 'Women\'s Health & OB/GYN',
    iconName: 'Stethoscope',
    shortDescription: 'Medical and minimally invasive management for uterine fibroids, ovarian cysts, chronic pelvic pain, and endometriosis.',
    fullDescription: 'Expert evaluation for benign pelvic disorders causing severe pain or heavy bleeding. We offer medical therapy, cyst monitoring, and guidance for keyhole laparoscopic procedures.',
    commonConditions: ['Uterine Fibroids (Myomas)', 'Ovarian Hemorrhagic / Dermoid Cysts', 'Pelvic Endometriosis', 'Adenomyosis'],
    procedures: ['High-Resolution Pelvic Scan', 'CA-125 Tumour Marker Test', 'Hormonal Medical Suppression', 'Laparoscopic Surgery Counseling'],
    durationMinutes: 35,
    priceEstimate: '₹400 Consultation',
    isTelehealthAvailable: false
  }
];

export const INSURANCE_PROVIDERS_DATA: InsuranceProvider[] = [
  {
    id: 'ins-1',
    name: 'Star Health & Allied Insurance',
    category: 'Commercial',
    status: 'In-Network',
    copayEstimate: 'Cashless Maternity & Surgical Benefits',
    popularPlans: ['Star Women Care Insurance', 'Young Star Health Plan', 'Comprehensive Family Health'],
    logoText: 'STAR HEALTH'
  },
  {
    id: 'ins-2',
    name: 'HDFC ERGO Health Insurance',
    category: 'Commercial',
    status: 'In-Network',
    copayEstimate: 'Direct Cashless Claim Processing',
    popularPlans: ['Optima Restore', 'My:Health Women Suraksha', 'Optima Secure'],
    logoText: 'HDFC ERGO'
  },
  {
    id: 'ins-3',
    name: 'Niva Bupa Health Insurance',
    category: 'Commercial',
    status: 'In-Network',
    copayEstimate: 'Cashless Admission Assistance',
    popularPlans: ['ReAssure 2.0', 'Health Companion', 'Heartbeat Plan'],
    logoText: 'NIVA BUPA'
  },
  {
    id: 'ins-4',
    name: 'Care Health Insurance (Religare)',
    category: 'Commercial',
    status: 'In-Network',
    copayEstimate: 'Reimbursement & Cashless Support',
    popularPlans: ['Care Advantage', 'Care Joy Maternity Plan', 'Care Supreme'],
    logoText: 'CARE HEALTH'
  },
  {
    id: 'ins-5',
    name: 'Ayushman Bharat & Karnataka Govt Schemes',
    category: 'Medicare/Medicaid',
    status: 'In-Network',
    copayEstimate: 'As per Govt Scheme Guidelines',
    popularPlans: ['AB-ARK (Arogya Karnataka)', 'Yeshasvini Scheme'],
    logoText: 'AYUSHMAN'
  }
];

export const PATIENT_REVIEWS_DATA: PatientReview[] = [
  {
    id: 'rev-1',
    patientName: 'Sowmya N.',
    doctorName: 'Dr. Shilpa, MBBS, MS (OBG)',
    department: 'Maternity Care',
    rating: 5,
    date: 'February 2, 2026',
    comment: 'Dr. Shilpa gave us immense confidence throughout my high-risk pregnancy. Her calm nature, clear explanation of scans, and prompt response during labor made my delivery smooth. Best mother care clinic in Tumakuru!',
    verified: true
  },
  {
    id: 'rev-2',
    patientName: 'Kavitha R.',
    doctorName: 'Dr. Shilpa, MBBS, MS (OBG)',
    department: 'Infertility Treatment',
    rating: 5,
    date: 'January 24, 2026',
    comment: 'After 3 years of trying for a child, we visited Dr. Shilpa for infertility guidance. She diagnosed my PCOS accurately and started follicular tracking. We were blessed with positive news within 4 months!',
    verified: true
  },
  {
    id: 'rev-3',
    patientName: 'Meenakshi K.',
    doctorName: 'Dr. Shilpa, MBBS, MS (OBG)',
    department: 'Fetal Medicine & Scans',
    rating: 5,
    date: 'February 8, 2026',
    comment: 'Got my anomaly scan done here. Dr. Shilpa explained every organ detail on the screen patiently. The clinic ambiance is so gentle, clean, and welcoming for pregnant mothers.',
    verified: true
  },
  {
    id: 'rev-4',
    patientName: 'Priya V.',
    doctorName: 'Dr. Shilpa, MBBS, MS (OBG)',
    department: 'PCOS & Gynaecology',
    rating: 5,
    date: 'January 18, 2026',
    comment: 'Suffered from irregular periods for years. Dr. Shilpa recommended a sensible lifestyle plan along with mild medication. My cycles are regular now. Very thankful!',
    verified: true
  }
];

export const FAQS_DATA = [
  {
    question: 'How do I book an appointment with Dr. Shilpa?',
    answer: 'Fill in your name, phone, and preferred date in the booking form on this site — it opens WhatsApp with your details ready to send. Reception will confirm your slot. You can also call or WhatsApp us directly at 0816 225 8890 / +91 98450 12345.'
  },
  {
    question: 'What are the clinic consultation timings?',
    answer: getConsultationTimingsFaqAnswer()
  },
  {
    question: 'Where is the clinic located in Tumakuru?',
    answer: 'Dr. Shilpa\'s Mother Care Speciality Clinic is located on Shettihalli Main Road, near Dasappa Garden Junction, Tumakuru, Karnataka 572102.'
  },
  {
    question: 'Are ultrasound scan facilities available on-site?',
    answer: 'Yes! We have advanced ultrasound scan equipment for antenatal growth scans, anomaly scans, follicular monitoring, and pelvic ultrasound evaluation.'
  },
  {
    question: 'Do you offer emergency obstetric care?',
    answer: 'Yes, 24/7 emergency phone triage and emergency delivery support are available for registered mothers.'
  }
];
