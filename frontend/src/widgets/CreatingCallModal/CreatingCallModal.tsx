import { Dayjs } from 'dayjs'
import { useEffect, useState } from 'react'

import i18n from '../../i18n'
import { ButtonBlue } from '../../shared/ui/ButtonBlue/ButtonBlue'
import { CustomCalendar } from '../../shared/ui/CustomCalendar/CustomCalendar'
import { CustomDivider } from '../../shared/ui/CustomDivider/CustomDivider'
import { CustomModalWindow } from '../../shared/ui/CustomModalWindow/CustomModalWindow'
import { CustomTimePicker } from '../../shared/ui/CustomTimePicker/CustomTimePicker'
import styles from './CreatingCallModal.module.scss'

export interface TimeSlot {
  from: string
  to: string
}

export interface TimeSlotsById {
  [key: number]: TimeSlot[]
}

interface CreatingCallModalProps {
  isOpen: boolean
  datesEmployment: TimeSlotsById
  onClose: () => void
  onClick: (
    selectedDates: string[] | null,
    selectedTime: Dayjs | null,
  ) => void
}

export const CreatingCallModal = ({
  isOpen,
  datesEmployment,
  onClose,
  onClick,
}: CreatingCallModalProps) => {
  const [selectedDates, setSelectedDates] = useState<string[] | null>(null)
  const [selectedTime, setSelectedTime] = useState<Dayjs | null>(null)

  const [isMobile, setIsMobile] = useState<boolean>(false)

  const allDatesEmployment: TimeSlot[] =
    Object.values(datesEmployment).flat()

  useEffect(() => {
    const handleResize = () => {
      const isMobileView = window.innerWidth <= 1000

      setIsMobile(isMobileView)
    }

    handleResize()

    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <CustomModalWindow
      isOpen={isOpen}
      maxWidth={isMobile ? '340px' : '665px'}
      padding='0px'
      backgroundColor='transparent'
      onClose={onClose}
    >
      <div className={styles.titleWrapper}>
        <span className={styles.title}>Select a date for the call</span>
      </div>
      <CustomDivider />
      <CustomCalendar
        dates={null}
        datesEmployment={allDatesEmployment}
        config={{
          type: isMobile ? 'default' : 'multiple',
          selectionDatesMode: 'single',
          locale: i18n.language,
          onClickDate(self) {
            setSelectedDates(self.context.selectedDates)
          },
        }}
      />
      <div className={styles.footer}>
        <CustomTimePicker
          title='Time'
          selectedTime={selectedTime}
          setSelectedTime={setSelectedTime}
        />
        <ButtonBlue
          title='Create a Call'
          style={styles.buttonSubmit}
          onClick={() => onClick(selectedDates, selectedTime)}
        />
      </div>
    </CustomModalWindow>
  )
}
