// Shared OTP storage for authentication
// In production, use Redis or a database instead of in-memory storage

interface OTPData {
  otp: string
  expiresAt: number
}

class OTPStorage {
  private storage: Map<string, OTPData>

  constructor() {
    this.storage = new Map()
  }

  set(phone: string, otp: string, expiresInMs: number = 5 * 60 * 1000) {
    const expiresAt = Date.now() + expiresInMs
    this.storage.set(phone, { otp, expiresAt })
  }

  get(phone: string): OTPData | undefined {
    return this.storage.get(phone)
  }

  delete(phone: string): boolean {
    return this.storage.delete(phone)
  }

  isExpired(phone: string): boolean {
    const data = this.get(phone)
    if (!data) return true
    return Date.now() > data.expiresAt
  }

  cleanup() {
    const now = Date.now()
    for (const [phone, data] of this.storage.entries()) {
      if (now > data.expiresAt) {
        this.storage.delete(phone)
      }
    }
  }
}

// Export singleton instance
export const otpStorage = new OTPStorage()

// Cleanup expired OTPs every minute
if (typeof window === 'undefined') {
  setInterval(() => {
    otpStorage.cleanup()
  }, 60 * 1000)
}
