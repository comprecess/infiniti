import { FC } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'

import { Input } from '../../../shared/ui/Input/Input'
import { SubmitButton } from '../../../shared/ui/SubmitButton/SubmitButton'
import styles from './ResetPasswordForm.module.scss'

interface FormFields {
  email: string
}

export const ResetPasswordForm: FC = () => {
  const { register, handleSubmit } = useForm<FormFields>()

  const onSubmit: SubmitHandler<FormFields> = data => {
    console.log('Success reset password:', data)
  }

  return (
    <div className={styles.wrapper}>
      <form className={styles.items} onSubmit={handleSubmit(onSubmit)}>
        <Input
          title='Email'
          placeholder='example@email.com'
          id='email'
          name='email'
          type='email'
          register={register}
          validationRules={{ required: true }}
        />
        <SubmitButton title='Reset password' type='submit' />
      </form>
    </div>
  )
}
