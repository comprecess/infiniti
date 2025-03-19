import { FC } from 'react'

interface IconProps {
  style?: string
}

export const PlusIcon: FC<IconProps> = ({ style }) => {
  return (
    <div className={style}>
      <svg
        width='16'
        height='16'
        viewBox='0 0 16 16'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
      >
        <path
          d='M1.1499 8H8.1499M15.1499 8H8.1499M8.1499 8V1M8.1499 8V15'
          stroke='#fff'
          strokeWidth='1.5'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
      </svg>
    </div>
  )
}
