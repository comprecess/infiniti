import styles from './TypeFiles.module.scss'

interface TypeFilesProps {
  type: string
}

export const TypeFiles = ({ type }: TypeFilesProps) => {
  let typeIcon = ''

  switch (type) {
    case 'pdf':
      typeIcon = '/icons/pdf.svg'
      break
    case 'csv':
      typeIcon = '/icons/file.svg'
      break
    case 'jpeg':
      typeIcon = '/icons/image.svg'
      break
    case 'zip':
      typeIcon = '/icons/zipFolder.svg'
      break
    case 'txt':
      typeIcon = '/icons/file.svg'
      break
    default:
      typeIcon = '/icons/fileEmpty.svg'
      break
  }

  return <img src={typeIcon} alt='Icon' className={styles.icon} />
}
