import React, { useCallback, useRef, useState } from 'react'

import styles from './CustomDropZone.module.scss'

interface CustomDropZoneProps {
  onDrop: (file: File) => void
}

export const CustomDropZone = ({ onDrop }: CustomDropZoneProps) => {
  const [isDragging, setIsDragging] = useState(false)
  const [fileInfo, setFileInfo] = useState<{
    name: string
  } | null>(null)

  const inputRef = useRef<HTMLInputElement | null>(null)
  const dropZoneRef = useRef<HTMLDivElement | null>(null)

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const dropZone = dropZoneRef.current
    const relatedTarget = e.relatedTarget as HTMLElement

    if (!dropZone || dropZone.contains(relatedTarget)) {
      return
    }

    setIsDragging(false)
  }, [])

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()

      if (!isDragging) {
        setIsDragging(true)
      }
    },
    [isDragging],
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()

      const files = e.dataTransfer.files
      if (files && files.length > 0) {
        const file = files[0]

        onDrop(file)

        setFileInfo({
          name: file.name,
        })
      }

      setIsDragging(false)
    },
    [onDrop],
  )

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      onDrop(file)
      setFileInfo({
        name: file.name,
      })
    }
  }

  const openFileDialog = () => {
    if (inputRef.current) {
      inputRef.current.click()
    }
  }

  return (
    <div
      ref={dropZoneRef}
      className={`${styles.dropzone} ${isDragging ? styles.dragging : ''}`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={openFileDialog}
    >
      <p className={styles.message}>
        {isDragging ? 'Release the file to download' : 'Drop File Here'}
      </p>
      {fileInfo && (
        <div className={styles.fileInfo}>
          {fileInfo.name && (
            <p>
              <strong>File Name:</strong>
              {` `}
              {fileInfo.name}
            </p>
          )}
        </div>
      )}
      <input
        ref={inputRef}
        type='file'
        style={{ display: 'none' }}
        onChange={handleFileSelect}
      />
    </div>
  )
}
