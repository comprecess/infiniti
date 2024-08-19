import { FC } from 'react'

interface IconProps {
  style?: string
}

export const CheckIcon: FC<IconProps> = ({ style }) => {
  return (
    <div className={style}>
      <svg
        width='25'
        height='24'
        viewBox='0 0 25 24'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
      >
        <path
          d='M4.1499 13L9.1499 18L20.1499 6'
          stroke='#09090B'
          strokeWidth='1.5'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
      </svg>
    </div>
  )
}
