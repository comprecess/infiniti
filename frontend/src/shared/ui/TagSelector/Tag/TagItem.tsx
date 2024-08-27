import { Tag, TagCloseButton, TagLabel } from '@chakra-ui/react'
import { FC } from 'react'

import styles from './TagItem.module.scss'

interface TagProps {
  title: string
  onRemove: () => void
}

export const TagItem: FC<TagProps> = ({ title, onRemove }) => {
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
