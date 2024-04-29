import { FC } from 'react'

interface ArrowsExpandIconProps {
  stroke?: string
}

export const ArrowsExpandIcon: FC<ArrowsExpandIconProps> = ({ stroke }) => {
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
          d='M2.5 17.5V12.8125M2.5 17.5H7.1875M2.5 17.5L17.5 2.5M17.5 2.5H12.8125M17.5 2.5V7.1875M2.5 2.5V7.1875M2.5 2.5H7.1875M2.5 2.5L17.5 17.5M17.5 17.5H12.8125M17.5 17.5V12.8125'
          stroke='#55586E'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
      </svg>
    </div>
  )
}
