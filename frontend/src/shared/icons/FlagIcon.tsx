interface IconProps {
  style?: string
}

export const FlagIcon = ({ style }: IconProps) => {
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
          d='M5.1499 4V15M5.1499 4V2M5.1499 4L6.46941 3.67012C8.1857 3.24105 10.0021 3.51134 11.5191 4.42154V4.42154C13.1889 5.4234 15.2131 5.6456 17.0604 5.02982L20.1499 4V15L17.0604 16.0298C15.2131 16.6456 13.1889 16.4234 11.5191 15.4215V15.4215C10.0021 14.5113 8.1857 14.2411 6.46941 14.6701L5.1499 15M5.1499 22V15'
          stroke='#09090B'
          strokeWidth='1.5'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
      </svg>
    </div>
  )
}
