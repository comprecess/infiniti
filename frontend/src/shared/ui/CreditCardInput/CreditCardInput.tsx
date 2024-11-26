import {
  CardElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js'
import { FC, useEffect, useState } from 'react'

import { ButtonBlue } from '../ButtonBlue/ButtonBlue'
import styles from './CreditCardInput.module.scss'

const cardElementOptions = {
  style: {
    base: {
      fontSize: '18px',
      color: '#666984',
      '::placeholder': {
        color: '#666984',
      },
    },
  },
}

interface CreditCardInputProps {
  postTokenStripeSend: (token: string) => void
}

export const CreditCardInput: FC<CreditCardInputProps> = ({
  postTokenStripeSend,
}) => {
  const [isStripeReady, setIsStripeReady] = useState<boolean>(false)

  const stripe = useStripe()
  const elements = useElements()

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!stripe || !elements) {
      return
    }
    const cardElement = elements.getElement(CardElement)
    if (cardElement) {
      const { token, error } = await stripe.createToken(cardElement)
      if (error) {
        console.error('Error creating token:', error.message)
      } else {
        postTokenStripeSend(token.id)
      }
    } else {
      console.error('CardElement not found')
    }
  }

  useEffect(() => {
    if (stripe && elements) {
      setIsStripeReady(true)
    } else {
      setIsStripeReady(false)
    }
  }, [stripe, elements])

  return (
    <div className={styles.wrapper}>
      <form onSubmit={onSubmit}>
        <label className={styles.label}>Credit or Debit card</label>
        {isStripeReady && (
          <div className={styles.wrapperCard}>
            <div className={styles.card}>
              <CardElement options={cardElementOptions} />
            </div>
          </div>
        )}
        {!isStripeReady && (
          <div className={styles.error}>Stripe Error</div>
        )}
        {isStripeReady && (
          <ButtonBlue
            title='Submit Payment'
            type='submit'
            style={styles.buttonSubmit}
          />
        )}
      </form>
    </div>
  )
}
