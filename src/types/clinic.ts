export type Department = 
  | 'All'
  | 'General Medicine & Primary Care'
  | 'Cardiology & Heart Health'
  | 'Pediatrics & Child Care'
  | 'Dermatology & Skin Care'
  | 'Orthopedics & Joint Care'
  | 'Neurology & Brain Health'
  | 'Women\'s Health & OB/GYN'
  | 'Dental & Oral Care'
  | 'Mental & Behavioral Health';

export interface Doctor {
  id: string;
  name: string;
  title: string;
  department: Department;
  qualification: string;
  experienceYears: number;
  rating: number;
  reviewCount: number;
  languages: string[];
  imageUrl: string;
  bio: string;
  specialties: string[];
  consultationFee: number;
  availableDays: string[]; // e.g. ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
  timeSlots: string[]; // e.g. ['09:00 AM', '10:30 AM', '02:00 PM', '03:30 PM']
  acceptingNewPatients: boolean;
  education: string;
  location: string;
}

export interface MedicalService {
  id: string;
  name: string;
  department: Department;
  iconName: string;
  shortDescription: string;
  fullDescription: string;
  commonConditions: string[];
  procedures: string[];
  durationMinutes: number;
  priceEstimate: string;
  isTelehealthAvailable: boolean;
}

export interface TimeSlot {
  time: string;
  available: boolean;
}

export interface InsuranceProvider {
  id: string;
  name: string;
  category: 'Commercial' | 'Government' | 'Medicare/Medicaid' | 'International';
  status: 'In-Network' | 'Out-of-Network' | 'Prior Authorization Required';
  copayEstimate: string;
  popularPlans: string[];
  logoText: string;
}

export interface PatientReview {
  id: string;
  patientName: string;
  doctorName: string;
  department: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
}
