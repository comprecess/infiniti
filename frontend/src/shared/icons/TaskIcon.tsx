import { FC } from 'react'

interface IconProps {
  style?: string
}

export const TaskIcon: FC<IconProps> = ({ style }) => {
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
          d='M11.15 20.0002L22.15 20.0002M11.15 12.0002L22.15 12.0002M11.15 4.00024H22.15M2.15002 4.00024L3.15002 5.00024L6.15002 2.00024M2.15002 12.0002L3.15002 13.0002L6.15002 10.0002M2.15002 20.0002L3.15002 21.0002L6.15002 18.0002'
          stroke='#09090B'
          strokeWidth='1.5'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
      </svg>
    </div>
  )
}
