import styles from './ManageButtons.module.scss'

interface ManageButtonsProps {
  firstButtonTitle?: string
  secondButtonTitle?: string
  thirdButtonTitle?: string
}

const titlesColors = {
  Download: styles.buttonDownload,
  Delete: styles.buttonDelete,
}

export const ManageButtons = ({
  firstButtonTitle,
  secondButtonTitle,
  thirdButtonTitle,
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
      <button className={styles.buttonFirst}>{firstButtonTitle}</button>
      <button className={styles.buttonSecond}>{secondButtonTitle}</button>
      <button className={titlesStyle}>{thirdButtonTitle}</button>
    </div>
  )
}
