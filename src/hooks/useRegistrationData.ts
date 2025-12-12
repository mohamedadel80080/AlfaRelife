'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

interface RegistrationData {
  languages?: number[]
  skills?: number[]
  softwares?: number[]
  [key: string]: any
}

interface RegistrationContextType {
  registrationData: RegistrationData
  updateRegistrationData: (data: Partial<RegistrationData>) => void
}

const RegistrationContext = createContext<RegistrationContextType | undefined>(undefined)

export function useRegistrationData() {
  const [registrationData, setRegistrationData] = useState<RegistrationData>({})

  const updateRegistrationData = (data: Partial<RegistrationData>) => {
    setRegistrationData(prev => ({ ...prev, ...data }))
    console.log('Registration data updated:', { ...registrationData, ...data })
  }

  return {
    registrationData,
    updateRegistrationData
  }
}

export function RegistrationProvider({ children }: { children: ReactNode }) {
  return (
    <RegistrationContext.Provider value={{ registrationData, updateRegistrationData }}>
      {children}
    </RegistrationContext.Provider>
  )
}