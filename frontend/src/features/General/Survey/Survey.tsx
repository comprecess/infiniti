import { Textarea, Checkbox, CheckboxGroup, RadioGroup, Radio, Stack } from '@chakra-ui/react'
import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'

import styles from './Survey.module.scss'
import { ChevronDownIcon } from '../../../shared/icons/ChevronDownIcon'
import { LogoTextIcon } from '../../../shared/icons/LogoTextIcon'
import { ButtonBlue } from '../../../shared/ui/ButtonBlue/ButtonBlue'
import { Logo } from '../../../shared/ui/Logo/Logo'

export type QuestionType = 'string' | 'checkbox' | 'radiobox'

export type Question =
  | { id: string; type: 'string'; question: string; required?: boolean }
  | { id: string; type: 'checkbox'; question: string; options: string[]; required?: boolean }
  | { id: string; type: 'radiobox'; question: string; options: string[]; required?: boolean }

interface SurveyProps {
  questions: Question[]
  onSubmit: (data: any) => void
  onClose: () => void
}

export const Survey = ({ questions, onSubmit, onClose }: SurveyProps) => {
  const { control, handleSubmit } = useForm()
  const [step, setStep] = useState(0)

  const currentQuestion = questions[step]
  const totalSteps = questions.length

  const handleNext = (data: any) => {
    if (step < totalSteps - 1) {
      setStep(prev => prev + 1)
    } else {
      onSubmit(data)
    }
  }

  const handlePrev = () => {
    if (step > 0) {
      setStep(prev => prev - 1)
    }
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <Logo logo={<LogoTextIcon style={styles.logoTextColor} />} />
        <button className={styles.closeBtn} onClick={onClose}>
          ✕
        </button>
      </div>
      <div className={styles.content}>
        <div className={styles.progress}>
          <div
            className={styles.progressBar}
            style={{ width: `${((step + 1) / totalSteps) * 100}%` }}
          />
          <span className={styles.progressText}>{`Шаг ${step + 1} из ${totalSteps}`}</span>
        </div>
        <div className={styles.formWrapper}>
          {step > 0 && (
            <div className={styles.backWrapper}>
              <div className={styles.container} onClick={handlePrev}>
                <ChevronDownIcon style={styles.icon} />
                <span className={styles.text}>Back</span>
              </div>
            </div>
          )}
          <form onSubmit={handleSubmit(handleNext)}>
            <h2 className={styles.question}>{currentQuestion.question}</h2>
            {currentQuestion.type === 'string' && (
              <Controller
                name={currentQuestion.id}
                control={control}
                rules={{ required: currentQuestion.required }}
                render={({ field }) => <Textarea {...field} placeholder='Введите ваш ответ...' />}
              />
            )}
            {currentQuestion.type === 'checkbox' && (
              <Controller
                name={currentQuestion.id}
                control={control}
                rules={{ required: currentQuestion.required }}
                render={({ field }) => (
                  <CheckboxGroup {...field}>
                    <Stack spacing={3}>
                      {(currentQuestion.options ?? []).map(opt => (
                        <Checkbox key={opt} value={opt}>
                          {opt}
                        </Checkbox>
                      ))}
                    </Stack>
                  </CheckboxGroup>
                )}
              />
            )}
            {currentQuestion.type === 'radiobox' && (
              <Controller
                name={currentQuestion.id}
                control={control}
                rules={{ required: currentQuestion.required }}
                render={({ field }) => (
                  <RadioGroup {...field}>
                    <Stack spacing={3}>
                      {(currentQuestion.options ?? []).map(opt => (
                        <Radio key={opt} value={opt}>
                          {opt}
                        </Radio>
                      ))}
                    </Stack>
                  </RadioGroup>
                )}
              />
            )}
            <div className={styles.actions}>
              <ButtonBlue title={step < totalSteps - 1 ? 'Next' : 'Complete'} />
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
