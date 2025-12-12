import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const questions = [
  {
    id: 3,
    question: "Have you ever been convicted of a felony or criminal offense that would affect your ability to practice pharmacy?"
  },
  {
    id: 4,
    question: "Have you ever been found guilty of professional malpractice, negligence, or misconduct in any healthcare setting?"
  },
  {
    id: 5,
    question: "Are you legally eligible to work in Canada without any restrictions?"
  },
  {
    id: 6,
    question: "Have you ever had your Provincial License restricted, suspended, or revoked for any reason?"
  },
  {
    id: 7,
    question: "Is your license currently registered as active and in good standing with your provincial regulatory authority?"
  }
]

async function seedQuestions() {
  console.log('🌱 Seeding healthcare questions...')

  for (const question of questions) {
    await prisma.healthcareQuestion.upsert({
      where: { id: question.id },
      update: question,
      create: question
    })
  }

  console.log('✅ Questions seeded successfully')
}

async function main() {
  try {
    await seedQuestions()
  } catch (error) {
    console.error('❌ Error seeding database:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

main()