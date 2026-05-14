import { useCallback, useEffect, useRef, useState, Fragment } from 'react'
import { useForm } from 'react-hook-form'

import styles from './KnowledgeBasePage.module.scss'
import { postKBMessage } from '../../../shared/utils/api/Client/KnowledgeBase/post-kb-message'
import { getKBHistory } from '../../../shared/utils/api/Client/KnowledgeBase/get-kb-history'
import { ButtonBlue } from '../../../shared/ui/ButtonBlue/ButtonBlue'
import { Input } from '../../../shared/ui/Input/Input'
import { LoadingSpinner } from '../../../shared/ui/LoadingSpinner/LoadingSpinner'

// Minimal markdown renderer: bold, italic, headings, bullet lists, line breaks
const renderMarkdown = (text: string) => {
  const lines = text.split('\n')
  const result: React.ReactNode[] = []
  let key = 0

  for (const line of lines) {
    const trimmed = line.trim()

    // Empty line → spacer
    if (!trimmed) {
      result.push(<div key={key++} style={{ height: '8px' }} />)
      continue
    }

    // Heading ### / ## / #
    const headingMatch = trimmed.match(/^(#{1,3})\s+(.+)/)
    if (headingMatch) {
      const level = headingMatch[1].length
      const Tag = (`h${Math.min(level + 2, 6)}`) as keyof JSX.IntrinsicElements
      result.push(<Tag key={key++} style={{ margin: '6px 0 2px', fontWeight: 700, fontSize: level === 1 ? '16px' : '15px', color: '#fff' }}>{inlineFormat(headingMatch[2])}</Tag>)
      continue
    }

    // Bullet list item
    const bulletMatch = trimmed.match(/^[-*•]\s+(.+)/)
    if (bulletMatch) {
      result.push(
        <div key={key++} style={{ display: 'flex', gap: '6px', margin: '2px 0' }}>
          <span style={{ flexShrink: 0, color: '#6b7aff' }}>•</span>
          <span>{inlineFormat(bulletMatch[1])}</span>
        </div>
      )
      continue
    }

    // Numbered list
    const numberedMatch = trimmed.match(/^(\d+)\.\s+(.+)/)
    if (numberedMatch) {
      result.push(
        <div key={key++} style={{ display: 'flex', gap: '6px', margin: '2px 0' }}>
          <span style={{ flexShrink: 0, color: '#6b7aff', minWidth: '18px' }}>{numberedMatch[1]}.</span>
          <span>{inlineFormat(numberedMatch[2])}</span>
        </div>
      )
      continue
    }

    // Regular paragraph line
    result.push(<p key={key++} style={{ margin: '3px 0', lineHeight: '1.7' }}>{inlineFormat(trimmed)}</p>)
  }

  return result
}

// Inline formatting: **bold**, *italic*, `code`
const inlineFormat = (text: string): React.ReactNode => {
  const parts: React.ReactNode[] = []
  const regex = /(\*\*(.+?)\*\*|\*(.+?)\*|`(.+?)`)/g
  let last = 0
  let match: RegExpExecArray | null

  while ((match = regex.exec(text)) !== null) {
    if (match.index > last) parts.push(text.slice(last, match.index))
    if (match[2]) parts.push(<strong key={match.index} style={{ fontWeight: 700, color: '#fff' }}>{match[2]}</strong>)
    else if (match[3]) parts.push(<em key={match.index}>{match[3]}</em>)
    else if (match[4]) parts.push(<code key={match.index} style={{ background: 'rgba(255,255,255,0.1)', padding: '1px 5px', borderRadius: '4px', fontSize: '13px' }}>{match[4]}</code>)
    last = match.index + match[0].length
  }

  if (last < text.length) parts.push(text.slice(last))
  return parts.length === 1 ? parts[0] : <>{parts}</>
}

const POPULAR_QUESTIONS = [
  'What is Infiniti and how does it work?',
  'How do I start building my product with Infiniti?',
  'How do I put together a team for my startup?',
  'How do I get funding for my project?',
  'What does the 90-day MVP launch process look like?',
  'How do I create a business plan on the platform?',
  'What subscription tiers are available and what do I get?',
  'How do I connect with investors through Infiniti?',
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

    // Normalise for dedup comparison
    const norm = (s: string) => s.trim().toLowerCase().replace(/[^a-zа-яё0-9 ]/gi, '').replace(/\s+/g, ' ')

    const seenQuestions = new Set<string>(POPULAR_QUESTIONS.map(norm))
    const pairs: QAItem[] = []

    for (const q of questions) {
      const text: string = (q.message ?? '').trim()
      if (!text) continue                          // skip empty
      const key = norm(text)
      if (seenQuestions.has(key)) continue         // skip duplicates / similar to popular
      seenQuestions.add(key)
      pairs.push({
        id:       q.id,
        question: text,
        answer:   answers.find((a: any) => a.id > q.id)?.message ?? null,
      })
    }

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
                    <div className={styles.answerText}>
                      {renderMarkdown(item.answer ?? '')}
                    </div>
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
