import { FC } from 'react'

interface IconProps {
  style?: string
}

export const ReplyIcon: FC<IconProps> = ({ style }) => {
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
          d='M2.15039 6H15.1504C19.0164 6 22.1504 9.13401 22.1504 13V13C22.1504 16.866 19.0164 20 15.1504 20H10.1504M2.15039 6L6.15039 2M2.15039 6L6.15039 10'
          stroke='#09090B'
          strokeWidth='1.5'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
      </svg>
    </div>
  )
}
