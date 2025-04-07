import 'vanilla-calendar-pro/styles/index.css'
import './CustomCalendar.scss'

import { HTMLAttributes, useEffect, useRef, useState } from 'react'
import { Calendar, Options } from 'vanilla-calendar-pro'

interface CustomCalendarProps extends HTMLAttributes<HTMLDivElement> {
  dates: string[] | null
  config?: Options
}

export const CustomCalendar = ({
  dates,
  config,
  ...attributes
}: CustomCalendarProps) => {
  const [calendar, setCalendar] = useState<Calendar | null>(null)

  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return

    setCalendar(
      new Calendar(ref.current, {
        ...config,
        displayDatesOutside: false,
        disableDatesPast: true,
        enableEdgeDatesOnly: true,
        onCreateDateEls(_self, dateEl) {
          const date = dateEl.getAttribute('data-vc-date')
          const isDisabled = dateEl.hasAttribute('data-vc-date-disabled')
          const isCurrentMonth =
            dateEl.getAttribute('data-vc-date-month') === 'current'

          if (
            date &&
            !isDisabled &&
            isCurrentMonth &&
            dates?.includes(date)
          ) {
            dateEl.innerHTML += `<span class="event-indicator"></span>`
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
