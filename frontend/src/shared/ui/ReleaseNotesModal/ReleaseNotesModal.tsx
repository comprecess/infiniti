import { Modal, ModalContent, ModalOverlay, ModalBody, ModalFooter, Button } from '@chakra-ui/react'
import { useState } from 'react'
import { ReleaseInfo } from '../../../app/data/releases'
import styles from './ReleaseNotesModal.module.scss'

interface ReleaseNotesModalProps {
  isOpen: boolean
  onClose: () => void
  release: ReleaseInfo | null
  buildCommit?: string
  buildTimestamp?: string
}

export const ReleaseNotesModal = ({
  isOpen,
  onClose,
  release,
  buildCommit,
  buildTimestamp,
}: ReleaseNotesModalProps) => {
  const [showDetails, setShowDetails] = useState(false)

  if (!release) return null

  const hasFeatures = release.features.length > 0
  const hasBugfixes = release.bugfixes.length > 0
  const hasImprovements = release.improvements.length > 0

  return (
    <Modal
      isCentered
      blockScrollOnMount
      preserveScrollBarGap
      isOpen={isOpen}
      autoFocus={false}
      motionPreset='scale'
      trapFocus={false}
      onClose={onClose}
      size='lg'
    >
      <ModalOverlay bg='blackAlpha.700' backdropFilter='blur(4px)' />
      <ModalContent
        className={styles.modalContent}
        maxWidth='520px'
        bg='#1a1a2e'
        borderRadius='16px'
        border='1px solid rgba(99, 102, 241, 0.2)'
        overflow='hidden'
      >
        <div className={styles.header}>
          <div className={styles.logoRow}>
            <svg width='24' height='24' viewBox='0 0 24 24' fill='none' className={styles.icon}>
              <circle cx='12' cy='12' r='10' stroke='#6366f1' strokeWidth='2' />
              <path d='M12 6v12M8 10l4-4 4 4' stroke='#6366f1' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
            </svg>
            <span className={styles.brand}>INFINITI Console</span>
          </div>
          <div className={styles.versionRow}>
            <span className={styles.versionBadge}>v{release.version}</span>
            <span className={styles.date}>{release.date}</span>
          </div>
          {release.title && <h2 className={styles.title}>{release.title}</h2>}
        </div>

        <ModalBody className={styles.body} p='0 24px'>
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>What&apos;s New</h3>

            {hasFeatures && (
              <div className={styles.category}>
                <span className={styles.categoryLabel}>Features</span>
                <ul className={styles.list}>
                  {release.features.map((item, i) => (
                    <li key={i} className={styles.listItem}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {hasBugfixes && (
              <div className={styles.category}>
                <span className={styles.categoryLabel}>Bug Fixes</span>
                <ul className={styles.list}>
                  {release.bugfixes.map((item, i) => (
                    <li key={i} className={styles.listItem}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {hasImprovements && (
              <div className={styles.category}>
                <span className={styles.categoryLabel}>Improvements</span>
                <ul className={styles.list}>
                  {release.improvements.map((item, i) => (
                    <li key={i} className={styles.listItem}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {showDetails && (
            <div className={styles.details}>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Build</span>
                <span className={styles.detailValue}>{buildCommit || 'N/A'}</span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Deployed</span>
                <span className={styles.detailValue}>
                  {buildTimestamp ? new Date(buildTimestamp).toLocaleString() : 'N/A'}
                </span>
              </div>
            </div>
          )}
        </ModalBody>

        <ModalFooter className={styles.footer} p='16px 24px 24px'>
          <Button
            variant='ghost'
            size='sm'
            color='#a5b4fc'
            _hover={{ bg: 'rgba(99, 102, 241, 0.1)' }}
            onClick={() => setShowDetails(!showDetails)}
          >
            {showDetails ? 'Hide Details' : 'View Details'}
          </Button>
          <Button
            size='sm'
            bg='#6366f1'
            color='white'
            _hover={{ bg: '#4f46e5' }}
            onClick={onClose}
            ml='auto'
          >
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
