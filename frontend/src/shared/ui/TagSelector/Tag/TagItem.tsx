import { Tag, TagCloseButton, TagLabel } from '@chakra-ui/react'

import styles from './TagItem.module.scss'

interface TagProps {
  title: string
  onRemove: () => void
}

export const TagItem = ({ title, onRemove }: TagProps) => {
  return (
    <Tag height='28px' color='white' backgroundColor='mint.700'>
      <TagLabel className={styles.title}>{title}</TagLabel>
      <TagCloseButton
        color='mint.400'
        _hover={{ color: 'mint.100' }}
        _active={{ color: 'mint.100' }}
        onClick={onRemove}
      />
    </Tag>
  )
}
