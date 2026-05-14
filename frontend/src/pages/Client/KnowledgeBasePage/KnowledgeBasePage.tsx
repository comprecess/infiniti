import { useCallback, useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'

import styles from './KnowledgeBasePage.module.scss'
import { postKBMessage } from '../../../shared/utils/api/Client/KnowledgeBase/post-kb-message'
import { getKBHistory } from '../../../shared/utils/api/Client/KnowledgeBase/get-kb-history'
import { ButtonBlue } from '../../../shared/ui/ButtonBlue/ButtonBlue'
import { Input } from '../../../shared/ui/Input/Input'
import { LoadingSpinner } from '../../../shared/ui/LoadingSpinner/LoadingSpinner'

const POPULAR_QUESTIONS = [
  'How does the Infiniti platform work?',
  'How do I create a business plan?',
  'How do I add and manage leads?',
  'How do I create an invoice?',
  'How do projects and tasks work?',
  'What is the Knowledge Base section for?',
]

interface QAItem {
  id: number | string
  question: string
  answer: string | null
  isLoading?: boolean
}

export const ClientKnowledgeBasePage = () => {
  const { register, handleSubmit, reset } = useForm<{ message: string }>({
    defaultValues: { message: '' },
  })

  const [items, setItems] = useState<QAItem[]>(() =>
    POPULAR_QUESTIONS.map((q, i) => ({
      id: `popular-${i}`,
      question: q,
      answer: null,
    }))
  )
  const [openId, setOpenId] = useState<number | string | null>(null)
  const [sending, setSending] = useState(false)
  const fetchingRef = useRef<Set<number | string>>(new Set())
  const listRef = useRef<HTMLDivElement>(null)

  // Load history once
  const loadHistory = useCallback(async () => {
    const res = await getKBHistory()
    if (!res.status) return
    const raw: any[] = res.data?.data ?? []
    const questions = raw.filter((m: any) => m.type === 'in')
    const answers   = raw.filter((m: any) => m.type === 'out')
    const pairs: QAItem[] = questions.map((q: any) => ({
      id:       q.id,
      question: q.message,
      answer:   answers.find((a: any) => a.id > q.id)?.message ?? null,
    }))
    if (pairs.length > 0) {
      setItems(prev => [...prev, ...pairs])
    }
  }, [])

  useEffect(() => {
    document.title = 'infiniti | Knowledge Base'
    loadHistory()
  }, [loadHistory])

  const fetchAnswer = (itemId: number | string, question: string) => {
    if (fetchingRef.current.has(itemId)) return
    fetchingRef.current.add(itemId)
    postKBMessage(question).then(res => {
      fetchingRef.current.delete(itemId)
      const answer = res.status
        ? (res.data?.data?.message ?? '')
        : 'Error getting response. Please try again.'
      setItems(prev => prev.map(i =>
        i.id === itemId ? { ...i, answer, isLoading: false } : i
      ))
    })
  }

  const toggle = (item: QAItem) => {
    if (openId === item.id) {
      setOpenId(null)
      return
    }
    setOpenId(item.id)
    if (item.answer === null && !item.isLoading) {
      setItems(prev => prev.map(i => i.id === item.id ? { ...i, isLoading: true } : i))
      fetchAnswer(item.id, item.question)
    }
  }

  const onSubmit = async ({ message }: { message: string }) => {
    if (!message.trim() || sending) return
    reset({ message: '' })
    setSending(true)

    const newId = Date.now()
    setItems(prev => [...prev, { id: newId, question: message, answer: null, isLoading: true }])
    setOpenId(newId)

    setTimeout(() => {
      listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' })
    }, 80)

    const res = await postKBMessage(message)
    const answer = res.status
      ? (res.data?.data?.message ?? '')
      : 'Error. Please try again.'
    setItems(prev => prev.map(i => i.id === newId ? { ...i, answer, isLoading: false } : i))
    setSending(false)
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.list} ref={listRef}>
        {items.map(item => {
          const isOpen = openId === item.id
          return (
            <div
              key={item.id}
              className={`${styles.item} ${isOpen ? styles.itemOpen : ''}`}
            >
              {/* Question pill — always visible, click to toggle */}
              <div
                className={styles.questionRow}
                onClick={() => toggle(item)}
              >
                <span className={styles.questionText}>{item.question}</span>
                <span className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ''}`}>
                  ›
                </span>
              </div>

              {/* Answer — only rendered when open */}
              {isOpen && (
                <div className={styles.answer}>
                  {item.isLoading ? (
                    <div className={styles.answerLoading}>
                      <LoadingSpinner size='sm' />
                      <span>Infiniti AI is thinking...</span>
                    </div>
                  ) : (
                    <p className={styles.answerText}>{item.answer}</p>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.inputWrapper}>
          <Input
            typeInput='brand'
            id='message'
            name='message'
            type='text'
            placeholder='Ask your question...'
            disabled={sending}
            register={register}
            validationRules={{ required: true }}
          />
        </div>
        <ButtonBlue
          type='submit'
          icon='/icons/send.svg'
          disabled={sending}
          iconProps={styles.buttonIcon}
          style={styles.sendButton}
        />
      </form>
    </div>
  )
}
