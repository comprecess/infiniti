import { FC } from 'react'

import styles from './RecentRightButtons.module.scss'

interface RecentRightButtonsProps {
  rightButtons?: (name: string) => void
}

export const RecentRightButtons: FC<RecentRightButtonsProps> = ({
  rightButtons,
}) => {
  const handleOnClick =
    (name: string): React.MouseEventHandler<HTMLButtonElement> =>
      () => {
        if (rightButtons) rightButtons(name)
      }

  return (
    <div className={styles.wrapper}>
      <button className={styles.buttonPDF} onClick={handleOnClick('pdf')}>
        <span className={styles.name}>PDF</span>
      </button>
      <button
        className={styles.buttonExcel}
        onClick={handleOnClick('excel')}
      >
        <span className={styles.name}>Excel</span>
      </button>
      <button className={styles.buttonCSV} onClick={handleOnClick('csv')}>
        <span className={styles.name}>CSV</span>
      </button>
      <button
        className={styles.buttonCopy}
        onClick={handleOnClick('copy')}
      >
        <span className={styles.name}>Copy</span>
      </button>
    </div>
  )
}
