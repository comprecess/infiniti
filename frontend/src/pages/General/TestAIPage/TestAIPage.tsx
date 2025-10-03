import { Box } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { useLocation, useNavigate } from 'react-router-dom'

import styles from './TestAIPage.module.scss'
import { ButtonBlue } from '../../../shared/ui/ButtonBlue/ButtonBlue'
import { CustomSelect } from '../../../shared/ui/CustomSelect/CustomSelect'
import { LoadingSpinner } from '../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { TextEditor } from '../../../shared/ui/TextEditor/TextEditor'
import { getTestInfo } from '../../../shared/utils/api/Test/get-test-info'
import { postSubmit } from '../../../shared/utils/api/Test/post-submit'
import { sanitizeMessage } from '../../../shared/utils/TextEditor/sanitizeMessage'
import { RecentCard } from '../../../widgets/RecentCard/RecentCard'

interface FormValues {
  businessModelId: number
  modelName: string
  questionAndAnswer: string
  promt: string
}

export const TestAIPage = () => {
  const [data, setData] = useState<any | null>(null)
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null)
  const [resultMessage, setResultMessage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const location = useLocation()
  const navigate = useNavigate()

  const { handleSubmit, control, reset, setValue } = useForm<FormValues>({
    defaultValues: {
      businessModelId: 0,
      modelName: '',
      questionAndAnswer: '',
      promt: '',
    },
  })

  const getInfo = async () => {
    const response = await getTestInfo()
    if (!response.status) return

    setData(response.data)
    reset({
      businessModelId: response.data.businessModel[0]?.id ?? 0,
      modelName: response.data.model[0] ?? '',
      questionAndAnswer: response.data.questionAndAnswer ?? '',
      promt: response.data.promt ?? '',
    })
  }

  useEffect(() => {
    getInfo()
  }, [location.search])

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search)
    const hashFromUrl = searchParams.get('hash')
    const expectedHash = import.meta.env.VITE_TEST_AI
    setIsAuthorized(hashFromUrl === expectedHash)
  }, [location.search])

  if (isAuthorized === null) return null
  if (!isAuthorized) {
    navigate('/404')

    return null
  }

  const onSubmit = async (form: FormValues) => {
    setIsSubmitting(true)
    const payload = {
      businessModel: form.businessModelId,
      model: form.modelName,
      questionAndAnswer: sanitizeMessage(form.questionAndAnswer),
      promt: sanitizeMessage(form.promt),
    }

    try {
      const response = await postSubmit(payload)

      if (response.status) {
        setResultMessage(response.message)
      } else {
        console.error('Error:', response)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.content}>
        {data ? (
          <RecentCard title='Test AI'>
            {isSubmitting ? (
              <div className={styles.loading}>
                <LoadingSpinner size='xl' />
              </div>
            ) : resultMessage ? (
              <div className='dangerouslySetInnerHTML'>
                <div
                  dangerouslySetInnerHTML={{ __html: sanitizeMessage(resultMessage) }}
                  className={styles.resultMessage}
                />
                <Box mt={6}>
                  <ButtonBlue
                    title='Try again'
                    type='button'
                    onClick={() => {
                      setResultMessage(null)
                      getInfo()
                    }}
                  />
                </Box>
              </div>
            ) : (
              <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
                <Controller
                  name='businessModelId'
                  control={control}
                  render={({ field }) => (
                    <CustomSelect
                      title='Business Models'
                      titleOnChange='businessModelId'
                      idList={data.businessModel.map((b: any) => b.id)}
                      nameList={data.businessModel.map((b: any) => b.title)}
                      value={field.value}
                      onChange={(_name, value) => field.onChange(value)}
                    />
                  )}
                />

                <Box mt={4}>
                  <Controller
                    name='modelName'
                    control={control}
                    render={({ field }) => (
                      <CustomSelect
                        title='AI Models'
                        titleOnChange='modelName'
                        idList={data.model.map((_: string, idx: number) => idx)}
                        nameList={data.model}
                        value={data.model.indexOf(field.value)}
                        onChange={(_name, value) => {
                          const modelName = data.model[value]
                          field.onChange(modelName)
                        }}
                      />
                    )}
                  />
                </Box>

                <Box mt={4}>
                  <div className={styles.containerItems}>
                    <span className={styles.containerItemsTitle}>Questions and Answers</span>
                    <TextEditor
                      placeholder='Enter questions and answers'
                      fieldName='questionAndAnswer'
                      defaultValue={sanitizeMessage(data.questionAndAnswer)}
                      setValue={(val: string) =>
                        setValue('questionAndAnswer', sanitizeMessage(val))
                      }
                    />
                  </div>
                </Box>

                <Box mt={4}>
                  <div className={styles.containerItems}>
                    <span className={styles.containerItemsTitle}>Prompt</span>
                    <TextEditor
                      placeholder='Enter promt'
                      fieldName='promt'
                      defaultValue={sanitizeMessage(data.promt)}
                      setValue={(val: string) => setValue('promt', sanitizeMessage(val))}
                    />
                  </div>
                </Box>

                <Box mt={6}>
                  <ButtonBlue title='Submit' type='submit' />
                </Box>
              </form>
            )}
          </RecentCard>
        ) : (
          <div className={styles.loading}>
            <LoadingSpinner size='xl' />
          </div>
        )}
      </div>
    </div>
  )
}
