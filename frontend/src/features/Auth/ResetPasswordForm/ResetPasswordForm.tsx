import { FC } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'

import { ButtonBlue } from '../../../shared/ui/ButtonBlue/ButtonBlue'
import { useCustomToast } from '../../../shared/ui/CustomToast/CustomToast'
import { Input } from '../../../shared/ui/Input/Input'
import { resetPassword } from '../../../shared/utils/api/Auth/ResetPassword'
import styles from './ResetPasswordForm.module.scss'

interface FormFields {
  email: string
}

export const ResetPasswordForm: FC = () => {
  const { register, handleSubmit } = useForm<FormFields>()

  const showToast = useCustomToast()

  const onSubmit: SubmitHandler<FormFields> = async data => {
    const resetPasswordResponse = await resetPassword(data.email)

    if (resetPasswordResponse.status) {
      showToast({
        title: 'Successful Reset',
        description: resetPasswordResponse.message,
        status: 'success',
      })
    } else {
      showToast({
        title: 'Reset Failed',
        description: resetPasswordResponse.message,
        status: 'error',
      })
    }
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
