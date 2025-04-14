import 'vanilla-calendar-pro/styles/index.css'
import './CustomCalendar.scss'

import { HTMLAttributes, useEffect, useRef, useState } from 'react'
import { Calendar, Options } from 'vanilla-calendar-pro'

import { TimeSlot } from '../../../widgets/CreatingCallModal/CreatingCallModal'

const generatePopups = (datesEmployment: TimeSlot[] | null) => {
  if (!datesEmployment) return {}

  const popups: { [key: string]: { modifier: string; html: string } } = {}

  datesEmployment.forEach(slot => {
    const date = slot.from.split(' ')[0]
    const fromTime = slot.from.split(' ')[1]
    const toTime = slot.to.split(' ')[1]

    if (popups[date]) {
      popups[date].html += `
        <p style="margin-top: 10px;">
          <strong>From:</strong> ${fromTime} <br />
          <strong>To:</strong> ${toTime}
        </p>
      `
    } else {
      popups[date] = {
        modifier: '',
        html: `
          <p>
            <strong>Busy</strong> <br />
            <strong>From:</strong> ${fromTime} <br />
            <strong>To:</strong> ${toTime}
          </p>
        `,
      }
    }
  })

  return popups
}

interface CustomCalendarProps extends HTMLAttributes<HTMLDivElement> {
  dates: string[] | null
  datesEmployment: TimeSlot[] | null
  config?: Options
}

export const CustomCalendar = ({
  dates,
  datesEmployment,
  config,
  ...attributes
}: CustomCalendarProps) => {
  const [calendar, setCalendar] = useState<Calendar | null>(null)

  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return

    const popups = generatePopups(datesEmployment)

    setCalendar(
      new Calendar(ref.current, {
        ...config,
        popups,
        displayDatesOutside: false,
        disableDatesPast: true,
        enableEdgeDatesOnly: true,
        onCreateDateEls(_self, dateEl) {
          const date = dateEl.getAttribute('data-vc-date')

          if (!date) return

          const isDisabled = dateEl.hasAttribute('data-vc-date-disabled')
          const isCurrentMonth =
            dateEl.getAttribute('data-vc-date-month') === 'current'

          const isDateInDates = dates?.includes(date)

          const hasEvent = datesEmployment?.some(
            slot =>
              slot.from.split(' ')[0] === date ||
              slot.to.split(' ')[0] === date,
          )

          if (
            !isDisabled &&
            isCurrentMonth &&
            (isDateInDates || hasEvent)
          ) {
            dateEl.style.backgroundColor = 'rgba(245, 159, 10, 0.1)'
            dateEl.style.borderRadius = '12px'
            dateEl.style.boxShadow = '0 4px 8px rgba(245, 159, 10, 0.1)'
          }
        },
      }),
    )
  }, [])

  useEffect(() => {
    if (!calendar) return

    calendar.init()
  }, [calendar])

  return <div {...attributes} ref={ref} />
}
