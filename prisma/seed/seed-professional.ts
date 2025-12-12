import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const sampleProfessional = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@pharmacy.com',
  phone: '+1 (555) 123-4567',
  password: 'Password123!', // Will be hashed
  address: '123 Main Street, Suite 100',
  city: 'Toronto',
  districtId: 'District 1 - Toronto Central',
  postcode: 'M5V 2T6',
  position: 'Pharmacist',
  licence: 'ON-123456',
  province: 'Ontario',
  licenceImage: '/uploads/licence-sample.jpg',
  profileImage: '/uploads/profile-sample.jpg',
  lat: 43.6532,
  lng: -79.3832,
  businessName: 'Community Pharmacy Plus',
  gst: '123456789',
  businessType: 'Independent Pharmacy',
  experience: 15,
  completed: true,
  hasBank: true,
  hasLanguages: true,
  hasSkills: true,
  hasSoftwares: true,
  status: 'active',
  isVerified: true,
  phoneVerified: true
}

const sampleLanguages = [
  'English',
  'French',
  'Spanish'
]

const sampleSkills = [
  'Clinical Pharmacy',
  'Medication Therapy Management',
  'Patient Counseling',
  'Immunizations',
  'Pharmacokinetics'
]

const sampleSoftwares = [
  'Kroll',
  'Pharmacy Management System',
  'McKesson',
  'Medi-Span'
]

async function seedSampleProfessional() {
  console.log('🌱 Seeding sample healthcare professional...')

  try {
    // Check if professional already exists
    const existingProfessional = await prisma.healthcareProfessional.findFirst({
      where: { email: sampleProfessional.email }
    })

    if (existingProfessional) {
      console.log('✅ Sample professional already exists')
      return
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(sampleProfessional.password, 10)

    // Create professional
    const professional = await prisma.healthcareProfessional.create({
      data: {
        ...sampleProfessional,
        password: hashedPassword
      }
    })

    console.log('✅ Created sample professional:', professional.firstName, professional.lastName)

    // Create languages
    for (const languageName of sampleLanguages) {
      await prisma.healthcareLanguage.create({
        data: {
          name: languageName,
          professionalId: professional.id
        }
      })
    }
    console.log('✅ Created sample languages')

    // Create skills
    for (const skillName of sampleSkills) {
      await prisma.healthcareSkill.create({
        data: {
          name: skillName,
          professionalId: professional.id
        }
      })
    }
    console.log('✅ Created sample skills')

    // Create softwares
    for (const softwareName of sampleSoftwares) {
      await prisma.healthcareSoftware.create({
        data: {
          name: softwareName,
          professionalId: professional.id
        }
      })
    }
    console.log('✅ Created sample softwares')

    console.log('🎉 Sample professional data seeded successfully!')

  } catch (error) {
    console.error('❌ Error seeding sample professional:', error)
    throw error
  }
}

async function main() {
  try {
    await seedSampleProfessional()
  } catch (error) {
    console.error('❌ Error seeding database:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

main()