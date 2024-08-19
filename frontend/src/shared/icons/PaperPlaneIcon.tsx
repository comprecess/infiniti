import { FC } from 'react'

interface IconProps {
  style?: string
}

export const PaperPlaneIcon: FC<IconProps> = ({ style }) => {
  return (
    <div className={style}>
      <svg
        width='25'
        height='24'
        viewBox='0 0 25 24'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
      >
        <g clipPath='url(#clip0_59_11918)'>
          <path
            d='M11.1499 13L12.6844 16.9899C13.7392 19.7326 14.2667 21.1039 14.9749 21.4489C15.5874 21.7472 16.3097 21.7132 16.8915 21.3586C17.5641 20.9486 17.9603 19.5338 18.7526 16.7041L21.6159 6.47824C22.1176 4.68672 22.3684 3.79096 22.1356 3.17628C21.9326 2.64035 21.5095 2.21724 20.9736 2.01427C20.3589 1.78147 19.4632 2.03228 17.6716 2.53391L7.44574 5.39716C4.61607 6.18947 3.20124 6.58563 2.79126 7.25828C2.43668 7.84005 2.40265 8.56231 2.70096 9.17484C3.04587 9.88306 4.41719 10.4105 7.15983 11.4654L11.1499 13ZM11.1499 13L13.6499 10.5'
            stroke='#09090B'
            strokeWidth='1.5'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
        </g>
        <defs>
          <clipPath id='clip0_59_11918'>
            <rect
              width='24'
              height='24'
              fill='white'
              transform='translate(0.149902)'
            />
          </clipPath>
        </defs>
      </svg>
    </div>
  )
}
