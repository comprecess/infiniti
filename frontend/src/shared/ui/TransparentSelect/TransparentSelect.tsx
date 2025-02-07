import { Select } from '@chakra-ui/react'
import { FC } from 'react'

interface TransparentSelectProps {
  options: { value: string; label: string }[]
  value: string
  onChange: (value: string) => void
}

export const TransparentSelect: FC<TransparentSelectProps> = ({
  options,
  value,
  onChange,
}) => {
  return (
    <Select
      value={value}
      variant='unstyled'
      _focus={{ boxShadow: 'none' }}
      _hover={{ backgroundColor: 'transparent' }}
      backgroundColor='transparent'
      color='white'
      border='none'
      appearance='none'
      sx={{
        display: 'inline-block',
        width: 'auto',
        minWidth: 'max-content',
      }}
      onChange={e => onChange(e.target.value)}
    >
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </Select>
  )
}
