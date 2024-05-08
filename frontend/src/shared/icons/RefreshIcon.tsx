import { FC } from 'react'

interface RefreshIconProps {
  stroke?: string
}

export const RefreshIcon: FC<RefreshIconProps> = ({ stroke }) => {
  return (
    <div className={stroke}>
      <svg
        width='20'
        height='20'
        viewBox='0 0 20 20'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
      >
        <path
          d='M1.6665 9.99999C1.6665 14.6024 5.39746 18.3333 9.99984 18.3333C14.6022 18.3333 17.4998 13.75 17.4998 13.75M18.3332 9.99999C18.3332 5.39762 14.6295 1.66666 9.99984 1.66666C4.44428 1.66666 1.6665 6.24999 1.6665 6.24999M1.6665 6.24999V3.33332M1.6665 6.24999H4.58317M17.4998 13.75H14.5832M17.4998 13.75V16.6667'
          stroke='#55586E'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
      </svg>
    </div>
  )
}
