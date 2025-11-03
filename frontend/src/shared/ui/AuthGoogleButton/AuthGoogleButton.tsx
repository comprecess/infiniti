import { Button, Image, useColorModeValue, useTheme } from '@chakra-ui/react'

export const AuthGoogleButton = () => {
  const theme = useTheme()

  const hoverBg = useColorModeValue(theme.colors.gray?.[100], 'whiteAlpha.100')
  const borderColor = useColorModeValue(theme.colors.gray?.[200], 'whiteAlpha.100')

  return (
    <div>
      <Button
        variant='ghost'
        border='2px solid'
        borderColor={borderColor}
        borderRadius='8px'
        height='48px'
        width='100%'
        fontFamily="'Space Grotesk', sans-serif"
        fontWeight='500'
        fontSize='16px'
        color='brand.1000'
        justifyContent='center'
        leftIcon={<Image src='/icons/google.png' alt='Google' boxSize='24px' />}
        _hover={{
          bg: hoverBg,
          boxShadow: '0 4px 14px rgba(0,0,0,0.08)',
        }}
      >
        Continue with Google
      </Button>
    </div>
  )
}
