import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET: Fetch all questions
export async function GET() {
  try {
    const questions = await db.healthcareQuestion.findMany({
      orderBy: {
        id: 'asc'
      }
    })

    return NextResponse.json({
      success: true,
      data: questions
    })

  } catch (error) {
    console.error('Error fetching questions:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST: Submit answers
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { professionalId, answers } = body

    if (!professionalId || !answers || !Array.isArray(answers)) {
      return NextResponse.json(
        { error: 'Invalid request data' },
        { status: 400 }
      )
    }

    // Validate each answer
    for (const answer of answers) {
      if (!answer.id || typeof answer.answer !== 'boolean') {
        return NextResponse.json(
          { error: 'Invalid answer format' },
          { status: 400 }
        )
      }
    }

    // Delete existing answers for this professional
    await db.healthcareAnswer.deleteMany({
      where: {
        professionalId
      }
    })

    // Create new answers
    const createdAnswers = await Promise.all(
      answers.map((answer: any) =>
        db.healthcareAnswer.create({
          data: {
            id: answer.id,
            answer: answer.answer,
            professionalId,
            questionId: answer.id
          }
        })
      )
    )

    return NextResponse.json({
      success: true,
      message: 'Answers submitted successfully',
      answers: createdAnswers
    })

  } catch (error) {
    console.error('Error submitting answers:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}