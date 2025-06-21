import styles from './ManageButtons.module.scss'

interface ManageButtonsProps {
  firstButtonTitle?: string
  secondButtonTitle?: string
  thirdButtonTitle?: string
  firstClick?: () => void
}

const titlesColors = {
  Download: styles.buttonDownload,
  Delete: styles.buttonDelete,
}

export const ManageButtons = ({
  firstButtonTitle,
  secondButtonTitle,
  thirdButtonTitle,
  firstClick,
}: ManageButtonsProps) => {
  let titlesStyle = ''

  switch (thirdButtonTitle) {
    case 'Download':
      titlesStyle = titlesColors.Download
      break
    case 'Delete':
      titlesStyle = titlesColors.Delete
      break
  }

  return (
    <div className={styles.wrapper}>
      {firstButtonTitle && (
        <button className={styles.buttonFirst} onClick={firstClick}>
          {firstButtonTitle}
        </button>
      )}
      {secondButtonTitle && (
        <button className={styles.buttonSecond}>
          {secondButtonTitle}
        </button>
      )}
      {thirdButtonTitle && (
        <button className={titlesStyle}>{thirdButtonTitle}</button>
      )}
    </div>
  )
}
