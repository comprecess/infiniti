import { Box, Text, useTheme } from '@chakra-ui/react'

import styles from './CardPlanError.module.scss'

interface CardPlanErrorProps {
  message?: string
}

export const CardPlanError = ({ message }: CardPlanErrorProps) => {
  const theme = useTheme()

  const textColor = theme.colors.cherry?.[500]

  return (
    <div className={styles.wrapper}>
      <div className={styles.logoSkeleton}>
        <Box
          w='220px'
          h='220px'
          borderRadius='8px'
          bg={theme.colors.brand?.[800]}
          display='flex'
          alignItems='center'
          justifyContent='center'
          flexDirection='column'
          textAlign='center'
          p={4}
        >
          <Text fontSize='16px' fontWeight='600' color={textColor}>
            Conversion Failed
          </Text>
          {message && (
            <Text fontSize='14px' color={textColor} mt={1}>
              {message}
            </Text>
          )}
        </Box>
      </div>
      <div className={styles.content}>
        <div className={styles.texts}>
          <Box
            h='36px'
            width='60%'
            borderRadius='4px'
            bg={theme.colors.brand?.[800]}
          />
          <Box
            h='24px'
            borderRadius='4px'
            bg={theme.colors.brand?.[800]}
            mt={2}
          />
          <Box
            h='24px'
            borderRadius='4px'
            bg={theme.colors.brand?.[800]}
            mt={2}
          />
        </div>
        <div className={styles.buttons}>
          <Box
            w='100px'
            h='48px'
            borderRadius='8px'
            bg={theme.colors.brand?.[800]}
          />
          <Box
            w='100px'
            h='48px'
            borderRadius='8px'
            bg={theme.colors.brand?.[800]}
          />
        </div>
      </div>
    </div>
  )
}
