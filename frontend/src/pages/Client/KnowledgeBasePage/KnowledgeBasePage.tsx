import { useCallback, useEffect, useRef, useState } from 'react'

import styles from './KnowledgeBasePage.module.scss'
import { postKBMessage } from '../../../shared/utils/api/Client/KnowledgeBase/post-kb-message'
import { getKBHistory } from '../../../shared/utils/api/Client/KnowledgeBase/get-kb-history'
import { ButtonBlue } from '../../../shared/ui/ButtonBlue/ButtonBlue'
import { Input } from '../../../shared/ui/Input/Input'
import { LoadingSpinner } from '../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { useForm } from 'react-hook-form'

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
  isPopular?: boolean
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
      isPopular: true,
    }))
  )
  const [openId, setOpenId] = useState<number | string | null>(null)
  const [sending, setSending] = useState(false)
  const [historyLoaded, setHistoryLoaded] = useState(false)
  const listRef = useRef<HTMLDivElement>(null)
  // track which ids are currently being fetched to avoid double-fetch
  const fetchingRef = useRef<Set<number | string>>(new Set())

  const loadHistory = useCallback(async () => {
    const res = await getKBHistory()
    if (res.status) {
      const raw: any[] = res.data?.data ?? []
      const questions = raw.filter((m: any) => m.type === 'in')
      const answers   = raw.filter((m: any) => m.type === 'out')
      const pairs: QAItem[] = questions.map((q: any) => {
        const answer = answers.find((a: any) => a.id > q.id) ?? null
        return {
          id: q.id,
          question: q.message,
          answer: answer?.message ?? null,
          isPopular: false,
        }
      })
      if (pairs.length > 0) {
        setItems(prev => [...prev, ...pairs])
      }
    }
    setHistoryLoaded(true)
  }, [])

  useEffect(() => {
    document.title = 'infiniti | Knowledge Base'
    loadHistory()
  }, [loadHistory])

  const toggle = async (itemId: number | string) => {
    // toggle closed
    if (openId === itemId) {
      setOpenId(null)
      return
    }
    setOpenId(itemId)

    // check current answer from latest state
    setItems(prev => {
      const current = prev.find(i => i.id === itemId)
      if (!current || current.answer !== null || current.isLoading) return prev
      // answer not yet loaded — mark loading and kick off fetch
      if (!fetchingRef.current.has(itemId)) {
        fetchingRef.current.add(itemId)
        postKBMessage(current.question).then(res => {
          fetchingRef.current.delete(itemId)
          if (res.status) {
            const msg = res.data?.data?.message ?? ''
            setItems(s => s.map(i => i.id === itemId ? { ...i, answer: msg, isLoading: false } : i))
          } else {
            setItems(s => s.map(i => i.id === itemId ? { ...i, answer: 'Error getting response. Please try again.', isLoading: false } : i))
          }
        })
      }
      return prev.map(i => i.id === itemId ? { ...i, isLoading: true } : i)
    })
  }

  const onSubmit = async ({ message }: { message: string }) => {
    if (!message.trim() || sending) return
    reset({ message: '' })
    setSending(true)

    const newId = Date.now()
    const newItem: QAItem = {
      id: newId,
      question: message,
      answer: null,
      isLoading: true,
      isPopular: false,
    }

    setItems(prev => [...prev, newItem])
    setOpenId(newId)

    setTimeout(() => {
      listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' })
    }, 100)

    const res = await postKBMessage(message)

    if (res.status) {
      const aiMsg = res.data?.data
      setItems(prev => prev.map(i =>
        i.id === newId ? { ...i, answer: aiMsg?.message ?? '', isLoading: false } : i
      ))
    } else {
      setItems(prev => prev.map(i =>
        i.id === newId ? { ...i, answer: 'Error. Please try again.', isLoading: false } : i
      ))
    }

    setSending(false)
  }

  return (
    <div className={styles.wrapper}>
      {/* Single scrollable area — everything scrolls together */}
      <div className={styles.list} ref={listRef}>
        {!historyLoaded && (
          <div className={styles.loadingWrap}><LoadingSpinner size='md' /></div>
        )}

        {items.map(item => {
          const isOpen = openId === item.id
          return (
            <div key={item.id} className={`${styles.item} ${isOpen ? styles.itemOpen : ''}`}>
              {item.isPopular && (
                <span className={styles.popularBadge}>Popular</span>
              )}
              <div className={styles.questionRow} onClick={() => toggle(item.id)}>
                <span className={styles.questionText}>{item.question}</span>
                <span className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ''}`}>›</span>
              </div>

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

      {/* Fixed input bar */}
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
