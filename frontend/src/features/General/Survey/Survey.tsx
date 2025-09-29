import { Textarea, Checkbox, CheckboxGroup, RadioGroup, Radio, Stack } from '@chakra-ui/react'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'

import styles from './Survey.module.scss'
import { Block, getVisibleQuestions } from './types'
import { ChevronDownIcon } from '../../../shared/icons/ChevronDownIcon'
import { LogoTextIcon } from '../../../shared/icons/LogoTextIcon'
import { ButtonBlue } from '../../../shared/ui/ButtonBlue/ButtonBlue'
import { useCustomToast } from '../../../shared/ui/CustomToast/CustomToast'
import { Logo } from '../../../shared/ui/Logo/Logo'
import { postSubmitSurvey } from '../../../shared/utils/api/Client/BusinessPlan/post-submit-survey'

interface SurveyProps {
  blocks: Block[]
  onSubmit: (data: Record<number, string | string[]> | null) => void
  onClose: () => void
}

export const Survey = ({ blocks, onSubmit, onClose }: SurveyProps) => {
  const [step, setStep] = useState(0)

  const [answers, setAnswers] = useState<Record<number, string | string[]>>({})

  const { control, setValue } = useForm()

  const visibleQuestions = getVisibleQuestions(blocks, answers)
  const currentQuestion = visibleQuestions[step]
  const totalSteps = visibleQuestions.length

  const showToast = useCustomToast()

  const currentAnswer = answers[currentQuestion.id]

  const isNextDisabled =
    currentAnswer === undefined ||
    (currentQuestion.type === 'string' && !(currentAnswer as string).trim()) ||
    (currentQuestion.type === 'checkbox' &&
      !(Array.isArray(currentAnswer) && currentAnswer.length > 0)) ||
    (currentQuestion.type === 'radiobox' && !(currentAnswer as string))

  const handleNext = async () => {
    if (step < totalSteps - 1) {
      setStep(prev => prev + 1)
    } else {
      const { status, message } = await postSubmitSurvey(answers)

      if (status) {
        showToast({
          title: 'Successfully',
          description: 'You have successfully completed the Survey',
          status: 'success',
        })
        onSubmit(answers)
      } else {
        showToast({
          title: 'Error',
          description: message,
          status: 'error',
        })
      }
    }
  }

  const handlePrev = () => step > 0 && setStep(prev => prev - 1)

  const handleChange = (value: string | string[]) => {
    setAnswers(prev => ({ ...prev, [currentQuestion.id]: value }))
    setValue(currentQuestion.id.toString(), value)
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
          <form
            onSubmit={e => {
              e.preventDefault()
              handleNext()
            }}
          >
            <h2 className={styles.question}>{currentQuestion.question}</h2>
            {currentQuestion.type === 'string' && (
              <Controller
                name={currentQuestion.id.toString()}
                control={control}
                render={({ field }) => (
                  <Textarea
                    {...field}
                    placeholder='Введите ваш ответ...'
                    value={(currentAnswer as string) || ''}
                    onChange={e => handleChange(e.target.value)}
                  />
                )}
              />
            )}
            {currentQuestion.type === 'checkbox' && (
              <Controller
                name={currentQuestion.id.toString()}
                control={control}
                render={({ field }) => (
                  <CheckboxGroup
                    {...field}
                    value={Array.isArray(currentAnswer) ? currentAnswer : []}
                    onChange={v => handleChange(v.map(val => val.toString()))}
                  >
                    <Stack spacing={3}>
                      {currentQuestion.options?.map(opt => (
                        <Checkbox key={opt.id} value={opt.id.toString()}>
                          {opt.description}
                        </Checkbox>
                      ))}
                    </Stack>
                  </CheckboxGroup>
                )}
              />
            )}
            {currentQuestion.type === 'radiobox' && (
              <Controller
                name={currentQuestion.id.toString()}
                control={control}
                render={({ field }) => (
                  <RadioGroup
                    {...field}
                    value={typeof currentAnswer === 'string' ? currentAnswer : ''}
                    onChange={v => handleChange(v)}
                  >
                    <Stack spacing={3}>
                      {currentQuestion.options?.map(opt => (
                        <Radio key={opt.id} value={opt.id.toString()}>
                          {opt.description}
                        </Radio>
                      ))}
                    </Stack>
                  </RadioGroup>
                )}
              />
            )}
            <div className={styles.actions}>
              <ButtonBlue
                title={step < totalSteps - 1 ? 'Next' : 'Complete'}
                disabled={isNextDisabled}
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
