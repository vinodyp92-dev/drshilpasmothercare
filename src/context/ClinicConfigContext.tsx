import React, { createContext, useContext } from 'react';
import { CONSULTATION_HOURS_DISPLAY } from '../utils/clinicHours';

export interface ClinicConfig {
  name: string;
  brandPrefix: string;
  brandAccent: string;
  tagline: string;
  taglineTransliteration: string;
  address: string;
  landmark: string;
  cityStatePincode: string;
  phone: string;
  mobile: string;
  mobileAlt: string;
  emergencyHotline: string;
  email: string;
  googleMapsUrl: string;
  googleMapsEmbedUrl: string;
  doctorWhatsapp: string;
  receptionistWhatsapp: string;
  hours: {
    weekdays: string;
    saturday: string;
    sunday: string;
    festivalNotice: string;
    urgentCare: string;
  };
  accreditation: string[];
}

export const CLINIC_CONFIG: ClinicConfig = {
  name: "Dr. Shilpa's MOTHER CARE",
  brandPrefix: "Dr. Shilpa's",
  brandAccent: 'MOTHER CARE',
  tagline: 'MAATRU RAKSHANAM PARAMO DHARMAH',
  taglineTransliteration: 'MAATRU RAKSHANAM PARAMO DHARMAH',
  address: 'Shettihalli Main Rd, Dasappa Garden',
  landmark: 'Near Dasappa Garden Junction',
  cityStatePincode: 'Tumakuru, Karnataka 572102',
  phone: '0816 4052517',
  mobile: '9900047256/9743033256',
  mobileAlt: '9743033256',
  emergencyHotline: '9743033256',
  email: 'care@drshilpamothercare.in',
  googleMapsUrl: 'https://maps.app.goo.gl/VXiQtJ3etaJ2tbB1A',
  googleMapsEmbedUrl:
    'https://www.google.com/maps?q=Dr.+Shilpa%27s+MOTHER+CARE,+Shettihalli+Main+Rd,+Dasappa+Garden,+Tumakuru,+Karnataka+572102&z=16&output=embed',
  doctorWhatsapp: '',
  receptionistWhatsapp: '9900047256',
  hours: {
    weekdays: CONSULTATION_HOURS_DISPLAY.weekdays,
    saturday: CONSULTATION_HOURS_DISPLAY.saturday,
    sunday: CONSULTATION_HOURS_DISPLAY.sunday,
    festivalNotice: CONSULTATION_HOURS_DISPLAY.festivalNotice,
    urgentCare: CONSULTATION_HOURS_DISPLAY.urgentCare
  },
  accreditation: [
    'Board Certified Obstetrician & Gynaecologist',
    'DNB (OBG) & Advanced Fetal Medicine',
    'Fertility & Reproductive Health Center',
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
