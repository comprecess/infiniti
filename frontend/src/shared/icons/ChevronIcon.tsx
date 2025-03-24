interface ChevronIconProps {
  stroke?: string
  onClick?: () => void
}

export const ChevronIcon = ({ stroke, onClick }: ChevronIconProps) => {
  return (
    <div className={stroke} onClick={onClick}>
      <svg
        width='20'
        height='20'
        viewBox='0 0 20 20'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
      >
        <path
          d='M5 7.5L10 12.5L15 7.5'
          stroke='#55586E'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
      </svg>
    </div>
  )
}
