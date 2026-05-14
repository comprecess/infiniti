import { useEffect, useState } from 'react'
import styles from './PopularQuestionsPage.module.scss'
import { customFetch } from '../../../../shared/utils/api/customFetch'

interface PopularQuestion {
  question: string
  ask_count: number
  last_asked: string
}

interface PinnedQuestion {
  id: number
  question: string
  ask_count: number
  is_default: number
}

export const PopularQuestionsPage = () => {
  const [popular, setPopular] = useState<PopularQuestion[]>([])
  const [pinned, setPinned] = useState<PinnedQuestion[]>([])
  const [loading, setLoading] = useState(true)
  const [newQuestion, setNewQuestion] = useState('')
  const [adding, setAdding] = useState(false)

  const load = async () => {
    setLoading(true)
    const res = await customFetch('/api/v1/resident/knowledge-base/popular', 'GET')
    const data = res?.data?.data ?? res?.data ?? {}
    setPopular(data.popular ?? [])
    setPinned(data.pinned ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const handleDeletePopular = async (question: string) => {
    if (!confirm('Remove all occurrences of this question from history?')) return
    await customFetch('/api/v1/resident/knowledge-base/popular', 'DELETE', { question })
    setPopular(prev => prev.filter(q => q.question !== question))
  }

  const handleToggleDefault = async (item: PinnedQuestion) => {
    await customFetch(`/api/v1/resident/knowledge-base/pinned/${item.id}`, 'PUT', {
      is_default: item.is_default ? 0 : 1,
    })
    setPinned(prev => prev.map(q => q.id === item.id ? { ...q, is_default: q.is_default ? 0 : 1 } : q))
  }

  const handleDeletePinned = async (id: number) => {
    if (!confirm('Delete this pinned question?')) return
    await customFetch(`/api/v1/resident/knowledge-base/pinned/${id}`, 'DELETE')
    setPinned(prev => prev.filter(q => q.id !== id))
  }

  const handleAddPinned = async () => {
    if (!newQuestion.trim()) return
    setAdding(true)
    const res = await customFetch('/api/v1/resident/knowledge-base/pinned', 'POST', {
      question: newQuestion.trim(),
      is_default: 1,
    })
    const id = res?.data?.data?.id ?? res?.data?.id
    if (id) {
      setPinned(prev => [{ id, question: newQuestion.trim(), ask_count: 0, is_default: 1 }, ...prev])
    }
    setNewQuestion('')
    setAdding(false)
  }

  const handlePinFromPopular = async (q: PopularQuestion) => {
    const res = await customFetch('/api/v1/resident/knowledge-base/pinned', 'POST', {
      question: q.question,
      ask_count: q.ask_count,
      is_default: 1,
    })
    const id = res?.data?.data?.id ?? res?.data?.id
    if (id) {
      setPinned(prev => [{ id, question: q.question, ask_count: q.ask_count, is_default: 1 }, ...prev])
    }
  }

  if (loading) return <div className={styles.loading}>Loading...</div>

  return (
    <div className={styles.wrapper}>
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Default Questions <span className={styles.hint}>(shown to clients on open)</span></h2>
        <div className={styles.addRow}>
          <input
            className={styles.input}
            placeholder="Add custom question..."
            value={newQuestion}
            onChange={e => setNewQuestion(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAddPinned()}
          />
          <button className={styles.addBtn} onClick={handleAddPinned} disabled={adding}>
            {adding ? '...' : 'Add'}
          </button>
        </div>
        {pinned.length === 0 ? (
          <p className={styles.empty}>No pinned questions yet</p>
        ) : (
          <div className={styles.list}>
            {pinned.map(item => (
              <div key={item.id} className={styles.item}>
                <div className={styles.itemLeft}>
                  <button
                    className={item.is_default ? styles.defaultBtnActive : styles.defaultBtn}
                    onClick={() => handleToggleDefault(item)}
                    title={item.is_default ? 'Shown by default (click to hide)' : 'Hidden (click to show by default)'}
                  >
                    {item.is_default ? '★' : '☆'}
                  </button>
                  <span className={styles.questionText}>{item.question}</span>
                </div>
                <div className={styles.itemRight}>
                  {item.ask_count > 0 && <span className={styles.count}>{item.ask_count}×</span>}
                  <button className={styles.deleteBtn} onClick={() => handleDeletePinned(item.id)}>✕</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Most Asked by Clients <span className={styles.hint}>({popular.length} unique questions)</span></h2>
        {popular.length === 0 ? (
          <p className={styles.empty}>No questions yet</p>
        ) : (
          <div className={styles.list}>
            {popular.map((q, i) => (
              <div key={i} className={styles.item}>
                <div className={styles.itemLeft}>
                  <span className={styles.rank}>#{i + 1}</span>
                  <span className={styles.questionText}>{q.question}</span>
                </div>
                <div className={styles.itemRight}>
                  <span className={styles.count}>{q.ask_count}×</span>
                  <button
                    className={styles.pinBtn}
                    onClick={() => handlePinFromPopular(q)}
                    title="Pin as default question"
                  >↑ Pin</button>
                  <button
                    className={styles.deleteBtn}
                    onClick={() => handleDeletePopular(q.question)}
                    title="Remove from history"
                  >✕</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
