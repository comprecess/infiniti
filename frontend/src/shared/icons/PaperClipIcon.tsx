interface IconProps {
  style?: string
}

export const PaperClipIcon = ({ style }: IconProps) => {
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
          d='M22.1499 12L15.3999 18.75C12.5004 21.6495 7.7994 21.6495 4.8999 18.75V18.75C2.00041 15.8505 2.00041 11.1495 4.8999 8.25L9.6499 3.5C11.5829 1.56701 14.7169 1.567 16.6499 3.5V3.5C18.5829 5.433 18.5829 8.567 16.6499 10.5L11.8999 15.25C10.9334 16.2165 9.3664 16.2165 8.3999 15.25V15.25C7.4334 14.2835 7.4334 12.7165 8.3999 11.75L13.1499 7'
          stroke='#fff'
          strokeWidth='1.5'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
      </svg>
    </div>
  )
}
