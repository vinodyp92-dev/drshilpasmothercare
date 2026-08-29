import React, { createContext, useContext } from 'react';
import { CONSULTATION_HOURS_DISPLAY } from '../utils/clinicHours';

export interface ClinicConfig {
  name: string;
  tagline: string;
  address: string;
  landmark: string;
  cityStatePincode: string;
  phone: string;
  mobile: string;
  emergencyHotline: string;
  email: string;
  googleMapsUrl: string;
  doctorWhatsapp: string;
  receptionistWhatsapp: string;
  hours: {
    weekdays: string;
    saturday: string;
    sunday: string;
    festivalNotice: string;
    urgentCare: string;
  };
  consultationFee: number;
  accreditation: string[];
}

export const CLINIC_CONFIG: ClinicConfig = {
  name: "Dr. Shilpa's Mother Care Speciality Clinic",
  tagline: 'Dedicated Maternity, Obstetrics, Gynaecology & Infertility Care',
  address: 'Shettihalli Main Rd, Dasappa Garden',
  landmark: 'Near Dasappa Garden Junction',
  cityStatePincode: 'Tumakuru, Karnataka 572102',
  phone: '0816 225 8890',
  mobile: '+91 98450 12345',
  emergencyHotline: '+91 98450 99999 / 108 Emergency',
  email: 'care@drshilpamothercare.in',
  googleMapsUrl: 'https://maps.app.goo.gl/VXiQtJ3etaJ2tbB1A',
  doctorWhatsapp: '+91 98450 12345',
  receptionistWhatsapp: '+91 99001 88776',
  hours: {
    weekdays: CONSULTATION_HOURS_DISPLAY.weekdays,
    saturday: CONSULTATION_HOURS_DISPLAY.saturday,
    sunday: CONSULTATION_HOURS_DISPLAY.sunday,
    festivalNotice: CONSULTATION_HOURS_DISPLAY.festivalNotice,
    urgentCare: CONSULTATION_HOURS_DISPLAY.urgentCare
  },
  consultationFee: 400,
  accreditation: [
    'Board Certified Obstetrician & Gynaecologist',
    'Advanced Fetal Medicine & Scan Facility',
    'Infertility & Reproductive Health Center',
    'Premier Mother Care Specialist in Tumakuru'
  ]
};

const ClinicConfigContext = createContext<ClinicConfig>(CLINIC_CONFIG);

export const ClinicConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ClinicConfigContext.Provider value={CLINIC_CONFIG}>{children}</ClinicConfigContext.Provider>
);

export const useClinicConfig = () => {
  const context = useContext(ClinicConfigContext);
  if (!context) {
    throw new Error('useClinicConfig must be used within a ClinicConfigProvider');
  }
  return { config: context };
};
