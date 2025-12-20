/**
 * API Utility Functions
 * Handles API requests with authentication
 * Uses Next.js proxy routes to avoid CORS issues
 */

const BASE_URL = '/api/proxy' // Use Next.js API routes as proxy

/**
 * Get the stored authentication token
 */
export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('auth_token')
}

/**
 * Get the token type (usually 'bearer')
 */
export function getTokenType(): string {
  if (typeof window === 'undefined') return 'bearer'
  return localStorage.getItem('token_type') || 'bearer'
}

/**
 * Clear all authentication data
 */
export function clearAuth(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem('auth_token')
  localStorage.removeItem('token_type')
  localStorage.removeItem('token_expires_in')
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  return !!getAuthToken()
}

/**
 * Get authorization header
 */
export function getAuthHeader(): HeadersInit {
  const token = getAuthToken()
  const tokenType = getTokenType()
  
  if (!token) return {}
  
  return {
    Authorization: `${tokenType} ${token}`
  }
}

/**
 * Make an authenticated API request
 */
export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint}`
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...getAuthHeader(),
    ...options.headers,
  }

  const response = await fetch(url, {
    ...options,
    headers,
  })

  // Handle 401 Unauthorized - auto logout
  if (response.status === 401) {
    clearAuth()
    // Redirect to login page
    if (typeof window !== 'undefined') {
      window.location.href = '/login'
    }
    throw new Error('Session expired. Please login again.')
  }

  // Safely parse JSON response
  let data: any
  try {
    const text = await response.text()
    if (text) {
      data = JSON.parse(text)
    } else {
      // Empty response - treat as success for some operations
      data = { status: true, message: 'Operation completed successfully' }
    }
  } catch (parseError) {
    console.error('Failed to parse JSON response:', parseError)
    // Check if response is HTML (common error case)
    const contentType = response.headers.get('content-type')
    if (contentType?.includes('text/html')) {
      throw new Error('Received HTML instead of JSON. Please check API endpoint and authentication.')
    }
    throw new Error('Invalid response format from server')
  }

  if (!response.ok) {
    // Handle validation errors
    if (data.errors) {
      const errorMessages = Object.values(data.errors).flat().join(', ')
      throw new Error(errorMessages as string)
    }
    throw new Error(data.message || `API Error: ${response.status}`)
  }

  return data
}

/**
 * Registration API call
 */
export interface RegistrationData {
  first_name: string
  last_name: string
  email: string
  phone: string
  password: string
  password_confirmation: string
  address: string
  city: string
  district_id: number
  postcode: string
  position: string
  licence: string
  province: string
  lat: number
  lng: number
  business_name: string
  gst: 'yes' | 'no'
  business_type: string
  image?: File | null
  licence_image?: File | null
}

export interface RegistrationResponse {
  access_token: string
  token_type: string
  expires_in: number
  phone_verified: boolean | null
  completed: boolean | null
  status: string | null
}

export async function register(data: RegistrationData): Promise<RegistrationResponse> {
  // Create FormData for multipart/form-data submission
  const formData = new FormData()
  
  // Add all text fields
  formData.append('first_name', data.first_name)
  formData.append('last_name', data.last_name)
  formData.append('email', data.email)
  formData.append('phone', data.phone)
  formData.append('password', data.password)
  formData.append('password_confirmation', data.password_confirmation)
  formData.append('address', data.address)
  formData.append('city', data.city)
  formData.append('district_id', data.district_id.toString())
  formData.append('postcode', data.postcode)
  formData.append('position', data.position)
  formData.append('licence', data.licence)
  formData.append('province', data.province)
  formData.append('lat', data.lat.toString())
  formData.append('lng', data.lng.toString())
  formData.append('business_name', data.business_name)
  formData.append('gst', data.gst)
  formData.append('business_type', data.business_type)
  
  // Add image files if provided
  if (data.image) {
    formData.append('image', data.image)
  }
  if (data.licence_image) {
    formData.append('licence_image', data.licence_image)
  }

  const response = await fetch('/api/proxy/register', {
    method: 'POST',
    body: formData,
    // Don't set Content-Type header - browser will set it with boundary
  })

  const result = await response.json()

  if (!response.ok) {
    // Handle validation errors
    if (result.errors) {
      const errorMessages = Object.values(result.errors).flat().join(', ')
      throw new Error(errorMessages as string)
    }
    throw new Error(result.message || `API Error: ${response.status}`)
  }

  return result
}

/**
 * Questions API interfaces and functions
 */
export interface Question {
  id: number
  question: string
}

export interface QuestionsResponse {
  data: Question[]
}

export interface Answer {
  id: number
  answer: boolean
}

/**
 * Districts API interfaces and functions
 */
export interface District {
  id: number
  name: string
}

export interface DistrictsResponse {
  data: District[]
}

/**
 * Fetch districts from API
 */
export async function fetchDistricts(): Promise<DistrictsResponse> {
  const response = await fetch('/api/proxy/districts', {
    method: 'GET',
    headers: {
      'Accept': 'application/json'
    }
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch districts')
  }

  return data
}

/**
 * Login API interfaces and functions
 */
export interface SendOTPRequest {
  phone: string
}

export interface SendOTPResponse {
  message?: string
  success?: boolean
}

export interface LoginRequest {
  phone: string
  otp: string
}

export interface LoginResponse {
  access_token: string
  token_type: string
  expires_in: number
  phone_verified: boolean
  completed: boolean
  status: string | number
}

/**
 * Send OTP to phone number
 */
export async function sendOTP(phone: string): Promise<SendOTPResponse> {
  const response = await fetch('/api/proxy/sendotp', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({ phone })
  })

  const data = await response.json()

  if (!response.ok) {
    // Handle validation errors
    if (data.errors) {
      const errorMessages = Object.values(data.errors).flat().join(', ')
      throw new Error(errorMessages as string)
    }
    throw new Error(data.message || 'Failed to send OTP')
  }

  return data
}

/**
 * Login with phone and OTP
 */
export async function loginWithOTP(phone: string, otp: string): Promise<LoginResponse> {
  const response = await fetch('/api/proxy/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({ phone, otp })
  })

  const data = await response.json()

  if (!response.ok) {
    // Handle validation errors
    if (data.errors) {
      const errorMessages = Object.values(data.errors).flat().join(', ')
      throw new Error(errorMessages as string)
    }
    throw new Error(data.message || 'Invalid OTP or login failed')
  }

  return data
}

/**
 * Fetch questions from API
 */
export async function fetchQuestions(): Promise<QuestionsResponse> {
  return apiRequest<QuestionsResponse>('/questions', {
    method: 'GET'
  })
}

/**
 * Submit answers to API
 * Note: This endpoint requires x-www-form-urlencoded format
 */
export async function submitAnswers(answers: Answer[]): Promise<any> {
  const token = getAuthToken()
  if (!token) {
    throw new Error('No authentication token found')
  }

  const formData = new URLSearchParams()
  
  answers.forEach((answer, index) => {
    formData.append(`question[${index}][id]`, answer.id.toString())
    formData.append(`question[${index}][answer]`, answer.answer.toString())
  })

  const response = await fetch('/api/proxy/answers', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: formData.toString()
  })

  const data = await response.json()

  if (!response.ok) {
    // Handle validation errors
    if (data.errors) {
      const errorMessages = Object.values(data.errors).flat().join(', ')
      throw new Error(errorMessages as string)
    }
    throw new Error(data.message || `API Error: ${response.status}`)
  }

  return data
}

/**
 * Profile API interfaces and functions
 */
export interface Language {
  id: number
  title: string
  deleted_at: string | null
  created_at: string
  updated_at: string
  pivot: {
    vendor_id: number
    language_id: number
  }
}

export interface Skill {
  id: number
  title: string
  deleted_at: string | null
  created_at: string
  updated_at: string
  pivot: {
    vendor_id: number
    skill_id: number
  }
}

export interface Software {
  id: number
  title: string
  deleted_at: string | null
  created_at: string
  updated_at: string
  pivot: {
    vendor_id: number
    software_id: number
  }
}

export interface ProfileData {
  id: number
  name: string
  first_name: string
  last_name: string
  email: string
  phone: string
  image: string
  address: string
  lat: string
  lng: string
  city: string
  district: string
  postcode: string
  position: string
  status: number
  province: string
  licence: string
  licence_image: string
  completed: number
  fcm_token: string | null
  created_at: string
  updated_at: string
  has_bank: number
  gst: string | null
  business_name: string | null
  business_type: string | null
  experience: boolean
  has_langauges: Language[]
  has_skills: Skill[]
  has_softwares: Software[]
}

export interface ProfileResponse {
  data: ProfileData
}

/**
 * Fetch user profile from API
 */
export async function fetchProfile(): Promise<ProfileResponse> {
  const token = getAuthToken()
  
  if (!token) {
    throw new Error('No authentication token found. Please login.')
  }

  return apiRequest<ProfileResponse>('/profile', {
    method: 'GET'
  })
}

/**
 * Update Profile API interfaces and functions
 */
export interface UpdateProfileRequest {
  first_name: string
  last_name: string
  email: string
  phone: string
  password?: string
  password_confirmation?: string
  address: string
  postcode: string
  position: string
  licence: string
  province: string
  city_id?: number
  village_id?: number
}

export interface UpdateProfileResponse {
  success: boolean
  message: string
  data: any
}

/**
 * Update user profile
 */
export async function updateProfile(data: UpdateProfileRequest): Promise<UpdateProfileResponse> {
  const token = getAuthToken()
  
  if (!token) {
    throw new Error('No authentication token found. Please login.')
  }

  // Remove password fields if they're empty
  const payload = { ...data }
  if (!payload.password || payload.password.trim() === '') {
    delete payload.password
    delete payload.password_confirmation
  }

  return apiRequest<UpdateProfileResponse>('/update-profile', {
    method: 'POST',
    body: JSON.stringify(payload)
  })
}

/**
 * Change Password API interfaces and functions
 */
export interface ChangePasswordRequest {
  old_password: string
  password: string
  password_confirmation: string
}

export interface ChangePasswordResponse {
  success: boolean
  message: string
  data: any
}

/**
 * Change user password
 */
export async function changePassword(data: ChangePasswordRequest): Promise<ChangePasswordResponse> {
  const token = getAuthToken()
  
  if (!token) {
    throw new Error('No authentication token found. Please login.')
  }

  return apiRequest<ChangePasswordResponse>('/update-password', {
    method: 'POST',
    body: JSON.stringify(data)
  })
}

/**
 * Bank Account API interfaces and functions
 */
export interface BankAccountData {
  id?: number
  transit: string
  institution: string
  account: string
  business_name: string
  business_number: string
  created_at?: string
  updated_at?: string
}

export interface BankAccountResponse {
  status?: boolean
  success?: string
  message?: string
  data?: BankAccountData
  stripe_account_id?: string
  remediation_link?: string
}

export interface UpdateBankAccountRequest {
  transit: string
  institution: string
  account: string
  business_name: string
  business_number: string
}

/**
 * Update bank account information
 */
export async function updateBankAccount(data: UpdateBankAccountRequest): Promise<BankAccountResponse> {
  const token = getAuthToken()
  
  if (!token) {
    throw new Error('No authentication token found. Please login.')
  }

  return apiRequest<BankAccountResponse>('/bank/update', {
    method: 'POST',
    body: JSON.stringify(data)
  })
}

/**
 * Home/Shifts API interfaces and functions
 */
export interface HomeFilters {
  paginate?: number
  price?: 'high' | 'low'
  date?: string  // Format: DD-MM-YYYY
  from?: string  // Format: DD-MM-YYYY
}

export interface ShiftItem {
  id: number
  date: string
  from: string
  to: string
  hours: number
  address: string
  lat: string
  lng: string
  pharmacy_id: number
  status: number
  hour_rate: number
  total: number
  created_at: string
  address_id: number
  applied_at: string | null
  applied: boolean
  applied_msg: string | null
  addres: {
    id: number
    title: string
    phone: string
    lat: string
    lng: string
    address: string
    city: string
    postcode: string
    district_id: number
    pharmacy_id: number
    created_at: string
    updated_at: string
  }
}

export interface HomeResponse {
  status: boolean
  data: Record<string, ShiftItem[]>  // Grouped by date
}

/**
 * Fetch home shifts with filters
 */
export async function fetchHomeShifts(filters?: HomeFilters): Promise<HomeResponse> {
  const token = getAuthToken()
  
  if (!token) {
    throw new Error('No authentication token found. Please login.')
  }

  // Build query string from filters
  const params = new URLSearchParams()
  if (filters) {
    if (filters.paginate) params.append('paginate', filters.paginate.toString())
    if (filters.price) params.append('price', filters.price)
    if (filters.date) params.append('date', filters.date)
    if (filters.from) params.append('from', filters.from)
  }

  const queryString = params.toString()
  const endpoint = queryString ? `/home?${queryString}` : '/home'

  return apiRequest<HomeResponse>(endpoint, {
    method: 'GET'
  })
}

/**
 * Pharmacy Offer API interfaces and functions
 */
export interface AcceptPharmacyOfferRequest {
  order_id: number
}

export interface SendPharmacistOfferRequest {
  order_id: number
  mileage?: number
  house?: number
  hour_rate?: number
  comment?: string
}

export interface OfferResponse {
  success: boolean
  message: string
  data?: any
}

/**
 * Accept pharmacy offer (direct acceptance without changes)
 */
export async function acceptPharmacyOffer(orderId: number): Promise<OfferResponse> {
  const token = getAuthToken()
  
  if (!token) {
    throw new Error('No authentication token found. Please login.')
  }

  const payload: AcceptPharmacyOfferRequest = {
    order_id: orderId
  }

  return apiRequest<OfferResponse>('/requests/offer', {
    method: 'POST',
    body: JSON.stringify(payload)
  })
}

/**
 * Send pharmacist custom offer
 * Only sends fields that are provided (not undefined)
 */
export async function sendPharmacistOffer(
  orderId: number,
  offerData?: {
    mileage?: number
    house?: number
    hour_rate?: number
    comment?: string
  }
): Promise<OfferResponse> {
  const token = getAuthToken()
  
  if (!token) {
    throw new Error('No authentication token found. Please login.')
  }

  // Build payload with only provided fields
  const payload: SendPharmacistOfferRequest = {
    order_id: orderId
  }

  // Only add fields if they are provided and not empty
  if (offerData) {
    if (offerData.mileage !== undefined && offerData.mileage !== null) {
      payload.mileage = offerData.mileage
    }
    if (offerData.house !== undefined && offerData.house !== null) {
      payload.house = offerData.house
    }
    if (offerData.hour_rate !== undefined && offerData.hour_rate !== null) {
      payload.hour_rate = offerData.hour_rate
    }
    if (offerData.comment && offerData.comment.trim() !== '') {
      payload.comment = offerData.comment
    }
  }

  return apiRequest<OfferResponse>('/requests/offer', {
    method: 'POST',
    body: JSON.stringify(payload)
  })
}

/**
 * Assigned Requests API interfaces and functions
 */
export interface AssignedShift {
  id: number
  date: string
  from: string
  to: string
  hours: number
  address: string
  lat: string
  lng: string
  pharmacy_id: number
  pharmacy: string | null  // Pharmacy name as string
  status: number
  hour_rate: number
  total: number
  created_at: string
  address_id?: number
  applied_at: string | null
  applied: boolean
  applied_msg: string | null
  distance: number
  faved: boolean
  assigned: number
  addres?: {
    id: number
    title: string
    phone: string
    lat: string
    lng: string
    address: string
    city: string
    postcode: string
    district_id: number
    pharmacy_id: number
    created_at?: string
    updated_at?: string
  }
}

export interface AssignedRequestsResponse {
  data: AssignedShift[]
  status?: boolean
  message?: string
}

/**
 * Fetch assigned shifts/requests for the logged-in user
 */
export async function fetchAssignedRequests(): Promise<AssignedRequestsResponse> {
  const token = getAuthToken()
  
  if (!token) {
    throw new Error('No authentication token found. Please login.')
  }

  return apiRequest<AssignedRequestsResponse>('/requests/assigned', {
    method: 'GET'
  })
}

/**
 * Accept Assigned Shift API interfaces and functions
 */
export interface AcceptShiftRequest {
  order_id: number
}

export interface AcceptShiftResponse {
  status: boolean
  message: string
  data?: any
}

/**
 * Accept an assigned shift
 */
export async function acceptAssignedShift(orderId: number): Promise<AcceptShiftResponse> {
  const token = getAuthToken()
  
  if (!token) {
    throw new Error('No authentication token found. Please login.')
  }

  const payload: AcceptShiftRequest = {
    order_id: orderId
  }

  return apiRequest<AcceptShiftResponse>('/requests/accept', {
    method: 'POST',
    body: JSON.stringify(payload)
  })
}

/**
 * Cancel Accepted Shift API interfaces and functions
 */
export interface CancelShiftResponse {
  status: boolean
  message: string
  data?: any
}

/**
 * Cancel an accepted shift
 */
export async function cancelAcceptedShift(orderId: number): Promise<CancelShiftResponse> {
  const token = getAuthToken()
  
  if (!token) {
    throw new Error('No authentication token found. Please login.')
  }

  const payload = {
    order_id: orderId
  }

  return apiRequest<CancelShiftResponse>(`/requests/cancell/${orderId}`, {
    method: 'POST',
    body: JSON.stringify(payload)
  })
}

/**
 * Shift Details API interfaces and functions
 */
export interface ShiftDetails {
  id: number
  date: string
  from: string
  to: string
  hours: number
  address: string
  lat: string
  lng: string
  city: string
  district_id: number
  district: {
    id: number
    name: string
    tax: number
  }
  pharmacy_id: number
  pharmacy: {
    id: number
    title: string
    email: string
    phone: string
    address: string
    logo: string
    cover: string
    city: string
  }
  hour_rate: number
  mileage: number
  house: number
  earning: number
  profit: number
  tax: number
  total: number
  comments: string | null
  applied: boolean
  applied_at: string | null
  applied_msg: string | null
  status: number
  languages: Array<{ id: number; title: string; selected: boolean }>
  skills: Array<{ id: number; title: string; selected: boolean }>
  softwares: Array<{ id: number; title: string; selected: boolean }>
  addres: {
    id: number
    title: string
    phone: string
    city: string
    postcode: string
  }
}

export interface ShiftDetailsResponse {
  status: boolean
  data: ShiftDetails
  message?: string
}

/**
 * Fetch detailed information for a specific shift by ID
 */
export async function fetchShiftDetails(shiftId: number | string): Promise<ShiftDetailsResponse> {
  const token = getAuthToken()
  
  if (!token) {
    throw new Error('No authentication token found. Please login.')
  }

  return apiRequest<ShiftDetailsResponse>(`/shifts/${shiftId}`, {
    method: 'GET'
  })
}

/**
 * Upcoming Shifts API interfaces and functions
 */
export interface UpcomingShift {
  id: number
  date: string
  from: string
  to: string
  hours: number
  address: string
  lat: string
  lng: string
  pharmacy_id: number
  status: number
  hour_rate: number
  total: number
  created_at: string
  address_id: number
  applied_at: string | null
  applied: boolean
  applied_msg: string | null
  pharmacy: string | null
  faved: boolean
  assigned: number
  addres?: {
    id: number
    title: string
    phone: string
    lat: string
    lng: string
    address: string
    city: string
    postcode: string
    district_id: number
    pharmacy_id: number
    created_at: string
    updated_at: string
  }
}

export interface UpcomingShiftsResponse {
  status: boolean
  data: UpcomingShift[]
  message?: string
}

/**
 * Fetch upcoming shifts for the logged-in user
 */
export async function fetchUpcomingShifts(): Promise<UpcomingShiftsResponse> {
  const token = getAuthToken()
  
  if (!token) {
    throw new Error('No authentication token found. Please login.')
  }

  return apiRequest<UpcomingShiftsResponse>('/requests/upcoming', {
    method: 'GET'
  })
}
