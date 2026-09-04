import { Doctor, MedicalService, PatientReview } from '../types/clinic';
import drShilpaImg from '../assets/images/dr_shilpa_official_1786535230073.jpg';

export const DOCTORS_DATA: Doctor[] = [
  {
    id: 'doc-shilpa',
    name: 'Dr. Shilpa Rani G R',
    title: 'Chief Obstetrician, Gynecologist & Fertility Specialist',
    department: 'Women\'s Health & OB/GYN',
    qualification: 'MBBS, MS (OBG), DNB (OBG), FRM',
    experienceYears: 15,
    rating: 5.00,
    reviewCount: 60,
    languages: ['Kannada', 'English', 'Hindi'],
    imageUrl: drShilpaImg,
    bio: 'Dr. Shilpa Rani G R is an Obstetrician and Gynaecologist at Mother Care Speciality Clinic and has an experience of 15+ years in this field.',
    specialties: ['High Risk Pregnancy Management', 'Fertility Evaluation & IUI', 'Antenatal & Postnatal Care', 'PCOS & Hormonal Care', 'Laparoscopic Gynaecology'],
    consultationFee: 400,
    availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    acceptingNewPatients: true,
    education: 'DNB (OBG), MS (OBG) Bangalore Medical College, MBBS Mysore Medical College',
    location: 'Mother Care Speciality Clinic - Main Consultation Suite'
  },
  {
    id: 'doc-sunil',
    name: 'Dr. Sunil Kumar C A, MBBS, MD',
    title: 'Family Physician',
    department: 'General Medicine & Primary Care',
    qualification: 'MBBS, MD (General Medicine)',
    experienceYears: 14,
    rating: 4.8,
    reviewCount: 150,
    languages: ['Kannada', 'English', 'Telugu'],
    imageUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=600',
    bio: 'Experienced family physician providing primary care, chronic disease management, preventive health checkups, and coordinated care for mothers and families at the clinic.',
    specialties: ['Primary Care Consultations', 'Hypertension & Diabetes Care', 'Preventive Health Screening', 'Family Wellness'],
    consultationFee: 350,
    availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
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
    name: 'Fertility Treatment',
    department: 'Women\'s Health & OB/GYN',
    iconName: 'Sparkles',
    shortDescription: 'Comprehensive fertility evaluation, follicular monitoring, hormonal profiling, and Intrauterine Insemination (IUI) guidance.',
    fullDescription: 'Compassionate and scientific fertility support for couples trying to conceive. Includes ovulation tracking via high-resolution ultrasound, tubal patency tests (HSG), semen analysis review, hormonal balancing, and IUI treatments.',
    commonConditions: ['Anovulatory Fertility', 'Unexplained Fertility', 'Low Ovarian Reserve', 'Male Factor Subfertility'],
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
    department: 'Fertility Treatment',
    rating: 5,
    date: 'January 24, 2026',
    comment: 'After 3 years of trying for a child, we visited Dr. Shilpa for Fertility guidance. She diagnosed my PCOS accurately and started follicular tracking. We were blessed with positive news within 4 months!',
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
