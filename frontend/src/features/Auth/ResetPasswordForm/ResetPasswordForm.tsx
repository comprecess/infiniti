import { FC } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'

import { ButtonBlue } from '../../../shared/ui/ButtonBlue/ButtonBlue'
import { Input } from '../../../shared/ui/Input/Input'
import { resetPassword } from '../../../shared/utils/api/Auth/ResetPassword'
import styles from './ResetPasswordForm.module.scss'

interface FormFields {
  email: string
}

export const ResetPasswordForm: FC = () => {
  const { register, handleSubmit } = useForm<FormFields>()

  const onSubmit: SubmitHandler<FormFields> = async data => {
    const resetPasswordResponse = await resetPassword(data.email)

    console.log(resetPasswordResponse)
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
        <ButtonBlue title='Reset password' type='submit' />
      </form>
    </div>
  )
}
