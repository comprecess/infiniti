export type FieldType = 'string' | 'checkbox' | 'radiobox'

export interface Answer {
  id: number
  description: string
  position: number
  field: FieldType
  child: Question[] | null
}

export interface Question {
  id: number
  type: 'question'
  description: string
  position: number
  field: FieldType | null
  child: Answer[] | null
}

export interface Block {
  id: number
  type: 'block'
  description: string
  position: number
  field: null
  child: Question[] | null
}

export interface FlattenedQuestion {
  id: number
  type: FieldType
  question: string
  options?: { id: number; description: string }[]
}

export const getVisibleQuestions = (
  blocks: Block[],
  answers: Record<number, string | string[]>,
): FlattenedQuestion[] => {
  const result: FlattenedQuestion[] = []

  blocks.forEach(block => {
    block.child?.forEach(q => {
      if (q.field === 'string') {
        result.push({ id: q.id, type: 'string', question: q.description })
      } else if (q.field === 'radiobox' || q.field === 'checkbox') {
        const options = q.child?.map(a => ({ id: a.id, description: a.description }))

        result.push({ id: q.id, type: q.field, question: q.description, options })

        const selectedAnswerId = answers[q.id]
        q.child?.forEach(a => {
          if (selectedAnswerId?.toString() === a.id.toString()) {
            a.child?.forEach(nestedQ => {
              if (nestedQ.field === 'string') {
                result.push({ id: nestedQ.id, type: 'string', question: nestedQ.description })
              }
            })
          }
        })
      }
    })
  })

  return result
}
