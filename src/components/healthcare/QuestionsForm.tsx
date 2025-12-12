'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, HelpCircle } from 'lucide-react'

interface Question {
  id: number
  question: string
}

interface Answer {
  id: number
  answer: boolean
}

interface QuestionsFormProps {
  onComplete: () => void
  onBack: () => void
}

export function QuestionsForm({ onComplete, onBack }: QuestionsFormProps) {
  const [questions, setQuestions] = useState<Question[]>([])
  const [answers, setAnswers] = useState<Answer[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Mock questions data - in real app, this would come from API
  const mockQuestions: Question[] = [
    { id: 3, question: "Have you ever been convicted of a felony or criminal offense that would affect your ability to practice pharmacy?" },
    { id: 4, question: "Have you ever been found guilty of professional malpractice, negligence, or misconduct in any healthcare setting?" },
    { id: 5, question: "Are you legally eligible to work in Canada without any restrictions?" },
    { id: 6, question: "Have you ever had your Provincial License restricted, suspended, or revoked for any reason?" },
    { id: 7, question: "Is your license currently registered as active and in good standing with your provincial regulatory authority?" }
  ]

  useEffect(() => {
    // Simulate API call to fetch questions
    const fetchQuestions = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000))
        setQuestions(mockQuestions)
        
        // Initialize answers with default false values
        const initialAnswers = mockQuestions.map(q => ({
          id: q.id,
          answer: false
        }))
        setAnswers(initialAnswers)
      } catch (error) {
        console.error('Error fetching questions:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchQuestions()
  }, [])

  const handleAnswerChange = (questionId: number, answer: boolean) => {
    setAnswers(prev => 
      prev.map(a => 
        a.id === questionId ? { ...a, answer } : a
      )
    )
  }

  const validateAnswers = () => {
    // All questions must be answered
    return answers.length === questions.length
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateAnswers()) {
      return
    }

    setIsSubmitting(true)
    
    try {
      // Prepare data for API submission
      const submissionData = answers.map((answer, index) => ({
        [`question[${index}][id]`]: answer.id,
        [`question[${index}][answer]`]: answer.answer
      })).reduce((acc, curr) => ({ ...acc, ...curr }), {})

      console.log('Submitting answers:', submissionData)

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Call the onComplete callback to proceed to next step
      onComplete()
    } catch (error) {
      console.error('Error submitting answers:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Loading questions...</span>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5" />
            Professional Background Questions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6">
            <AlertDescription>
              Please answer all questions honestly. Your responses will be verified during the registration process.
            </AlertDescription>
          </Alert>

          <div className="space-y-6">
            {questions.map((question, index) => {
              const answer = answers.find(a => a.id === question.id)
              return (
                <div key={question.id} className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <Label 
                        htmlFor={`question-${question.id}`}
                        className="text-sm font-medium text-gray-700 cursor-pointer"
                      >
                        <span className="font-semibold text-blue-600">{index + 1}.</span> {question.question}
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3 ml-4">
                      <span className="text-sm text-gray-500">No</span>
                      <Switch
                        id={`question-${question.id}`}
                        checked={answer?.answer || false}
                        onCheckedChange={(checked) => handleAnswerChange(question.id, checked)}
                        disabled={isSubmitting}
                      />
                      <span className="text-sm text-gray-500">Yes</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Form Actions */}
      <div className="flex justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          disabled={isSubmitting}
        >
          Back
        </Button>
        <Button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2"
          disabled={isSubmitting || !validateAnswers()}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Submitting...
            </>
          ) : (
            'Submit Answers & Login'
          )}
        </Button>
      </div>
    </form>
  )
}