export interface HealthcareProfessional {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  city: string
  districtId: string
  postcode: string
  position: string
  licence: string
  province: string
  licenceImage: string
  profileImage: string
  lat: number
  lng: number
  businessName: string
  gst: string
  businessType?: string
  experience?: number
  fcmToken?: string
  completed: boolean
  hasBank: boolean
  hasLanguages: boolean
  hasSkills: boolean
  hasSoftwares: boolean
  status: 'active' | 'inactive' | 'suspended'
  isVerified: boolean
  phoneVerified: boolean
  createdAt: Date
  updatedAt: Date
}

export interface HealthcareLanguage {
  id: string
  name: string
  professionalId: string
}

export interface HealthcareSkill {
  id: string
  name: string
  professionalId: string
}

export interface HealthcareSoftware {
  id: string
  name: string
  professionalId: string
}

export interface ProfileFormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  postcode: string
  position: string
  licence: string
  province: string
  gst?: string
  businessName?: string
  businessType?: string
  experience?: number
}

export interface PasswordFormData {
  oldPassword: string
  password: string
  passwordConfirmation: string
}

export interface SettingsFormData {
  languages: string[]
  skills: string[]
  softwares: string[]
  experience?: number
}

export interface FormErrors {
  [key: string]: string | undefined
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export const POSITIONS = [
  'Pharmacist',
  'Pharmacy Technician',
  'Pharmacy Assistant',
  'Clinical Pharmacist',
  'Hospital Pharmacist',
  'Community Pharmacist',
  'Consultant Pharmacist',
  'Pharmacy Manager',
  'Pharmacy Owner',
  'Other'
] as const

export const PROVINCES = [
  'Ontario',
  'British Columbia',
  'Alberta',
  'Quebec',
  'Manitoba',
  'Saskatchewan',
  'Nova Scotia',
  'New Brunswick',
  'Newfoundland and Labrador',
  'Prince Edward Island',
  'Northwest Territories',
  'Yukon',
  'Nunavut'
] as const

export const BUSINESS_TYPES = [
  'Independent Pharmacy',
  'Chain Pharmacy',
  'Hospital Pharmacy',
  'Clinical Pharmacy',
  'Compounding Pharmacy',
  'Long-term Care Pharmacy',
  'Mail Order Pharmacy',
  'Specialty Pharmacy',
  'Other'
] as const

export const LANGUAGES = [
  'English',
  'French',
  'Spanish',
  'Mandarin',
  'Cantonese',
  'Punjabi',
  'Hindi',
  'Urdu',
  'Arabic',
  'Portuguese',
  'Italian',
  'German',
  'Tagalog',
  'Vietnamese',
  'Korean',
  'Russian',
  'Japanese',
  'Polish',
  'Gujarati',
  'Tamil'
] as const

export const SKILLS = [
  'Clinical Pharmacy',
  'Medication Therapy Management',
  'Patient Counseling',
  'Compounding',
  'Sterile Compounding',
  'Non-Sterile Compounding',
  'Medication Review',
  'Chronic Disease Management',
  'Immunizations',
  'Health Screening',
  'Medication Synchronization',
  'Adherence Counseling',
  'Disease State Education',
  'Pharmacokinetics',
  'Drug Information',
  'Formulary Management',
  'Inventory Management',
  'Quality Assurance',
  'Regulatory Compliance',
  'Staff Training',
  'Customer Service'
] as const

export const SOFTWARES = [
  'Kroll',
  'RxConnect',
  'Pharmacy Management System',
  'QS/1',
  'Computer-Rx',
  'PioneerRx',
  'Rx30',
  'BestRx',
  'Liberty Software',
  'McKesson',
  'AmerisourceBergen',
  'Cardinal Health',
  'Medi-Span',
  'Lexicomp',
  'Clinical Pharmacology',
  'Micromedex',
  'UpToDate',
  'Epocrates',
  'Medscape',
  'Adobe Acrobat',
  'Microsoft Office',
  'Google Workspace'
] as const

export type Position = typeof POSITIONS[number]
export type Province = typeof PROVINCES[number]
export type BusinessType = typeof BUSINESS_TYPES[number]
export type Language = typeof LANGUAGES[number]
export type Skill = typeof SKILLS[number]
export type Software = typeof SOFTWARES[number]