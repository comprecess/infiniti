import { Button, Image, useColorModeValue, useTheme } from '@chakra-ui/react'

import { getGoogleAuthUrl } from '../../utils/api/Auth/get-google-auth-url'

interface AuthGoogleButtonProps {
  isAdmin: boolean
}

export const AuthGoogleButton = ({ isAdmin }: AuthGoogleButtonProps) => {
  const theme = useTheme()

  const hoverBg = useColorModeValue(theme.colors.gray?.[100], 'whiteAlpha.100')
  const borderColor = useColorModeValue(theme.colors.gray?.[200], 'whiteAlpha.100')

  const handleNavigateToGoogleAuth = async () => {
    const response = await getGoogleAuthUrl(isAdmin)

    if (!response.status) return

    window.location.href = response.data.redirect
  }

  return (
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
      onClick={handleNavigateToGoogleAuth}
    >
      Continue with Google
    </Button>
  )
}
