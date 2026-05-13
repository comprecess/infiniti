import styles from './SuggestedQuestion.module.scss'

interface SuggestedQuestionProps {
  question: string
  onClick: () => void
}

export const SuggestedQuestion = ({ question, onClick }: SuggestedQuestionProps) => {
  return (
    <div className={styles.wrapper} onClick={onClick}>
      <p className={styles.question}>{question}</p>
    </div>
  )
}
