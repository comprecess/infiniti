import { FC, useEffect, useRef, useState } from 'react'

import { TagItem } from './Tag/TagItem'
import styles from './TagSelector.module.scss'

interface TagSelectorProps {
  list: string[]
  selectedTags: string[]
  onTagsChange: (tags: string[]) => void
}

export const TagSelector: FC<TagSelectorProps> = ({
  list,
  selectedTags,
  onTagsChange,
}) => {
  const [tags, setTags] = useState<string[]>(selectedTags)
  const [inputValue, setInputValue] = useState('')
  const [filteredTags, setFilteredTags] = useState<string[]>([])
  const [showSelect, setShowSelect] = useState(false)

  const selectRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
    setShowSelect(true)
  }

  const handleTagSelect = (tag: string) => {
    if (!tags.includes(tag)) {
      setTags([...tags, tag])
    }
    setInputValue('')
    setShowSelect(false)
  }

  const handleInputKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === 'Enter' && inputValue.trim() !== '') {
      e.preventDefault()
      if (!tags.includes(inputValue.trim())) {
        setTags([...tags, inputValue.trim()])
      }
      setInputValue('')
      setShowSelect(false)
    }
  }

  const handleDocumentClick = (e: MouseEvent) => {
    if (
      selectRef.current &&
      !selectRef.current.contains(e.target as Node) &&
      inputRef.current &&
      !inputRef.current.contains(e.target as Node)
    ) {
      setShowSelect(false)
    }
  }

  const handleInputFocus = () => {
    setShowSelect(true)
  }

  const handleTagRemove = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  useEffect(() => {
    if (inputValue === '') {
      setFilteredTags(list.filter(tag => !tags.includes(tag)))
    } else {
      setFilteredTags(
        list.filter(
          tag =>
            !tags.includes(tag) &&
            tag.toLowerCase().includes(inputValue.toLowerCase()),
        ),
      )
    }
  }, [inputValue, list, tags])

  useEffect(() => {
    onTagsChange(tags)
  }, [tags])

  useEffect(() => {
    document.addEventListener('mousedown', handleDocumentClick)

    return () => {
      document.removeEventListener('mousedown', handleDocumentClick)
    }
  }, [])

  return (
    <div className={styles.wrapper}>
      <span className={styles.title}>Tags</span>
      <div ref={selectRef} className={styles.inputWrapper}>
        <input
          ref={inputRef}
          type='text'
          value={inputValue}
          className={styles.input}
          onChange={handleInputChange}
          onKeyDown={handleInputKeyDown}
          onFocus={handleInputFocus}
        />
        {showSelect && filteredTags.length > 0 && (
          <div className={styles.selectDropdown}>
            {filteredTags.map(tag => (
              <div
                key={tag}
                className={styles.selectOption}
                onClick={() => handleTagSelect(tag)}
              >
                <span className={styles.tagListTitle}>{tag}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      {tags.length > 0 && (
        <div className={styles.tagList}>
          {tags.map((tag, index) => (
            <TagItem
              key={`${tag}-${index}`}
              title={tag}
              onRemove={() => handleTagRemove(tag)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
