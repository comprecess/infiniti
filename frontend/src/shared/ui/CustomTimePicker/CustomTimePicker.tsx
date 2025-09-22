import { createTheme } from '@mui/material/styles'
import ThemeProvider from '@mui/system/ThemeProvider'
import { LocalizationProvider, TimeField } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { Dayjs } from 'dayjs'
import { Dispatch, SetStateAction } from 'react'

import styles from './CustomTimePicker.module.scss'
import i18n from '../../../i18n'

const theme = createTheme({
  palette: {
    primary: {
      main: '#1b1e29',
      dark: '#1b1e29',
      light: '#1b1e29',
    },
    secondary: {
      main: '#55586e',
      dark: '#55586e',
      light: '#55586e',
    },
  },
})

interface CustomTimePickerProps {
  title: string
  selectedTime: Dayjs | null
  setSelectedTime: Dispatch<SetStateAction<Dayjs | null>>
}

export const CustomTimePicker = ({
  title,
  selectedTime,
  setSelectedTime,
}: CustomTimePickerProps) => {
  return (
    <div className={styles.wrapper}>
      <ThemeProvider theme={theme}>
        <LocalizationProvider
          dateAdapter={AdapterDayjs}
          adapterLocale={i18n.language}
        >
          <div className={styles.container}>
            {title && <span className={styles.title}>{title}</span>}
            <TimeField
              value={selectedTime}
              format='HH:mm'
              style={{
                height: '48px',
                borderRadius: '0.75rem',
                backgroundColor: theme.palette.primary.dark,
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  height: '48px',
                  borderRadius: '8px',
                  border: 'none',
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    border: 'none',
                  },
                  '&.Mui-focused': {
                    border: 'none',
                  },
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  border: 'none',
                },
                '& .MuiInputBase-input': {
                  fontSize: '16px',
                  color: theme.palette.secondary.dark,
                },
              }}
              onChange={setSelectedTime}
            />
          </div>
        </LocalizationProvider>
      </ThemeProvider>
    </div>
  )
}
