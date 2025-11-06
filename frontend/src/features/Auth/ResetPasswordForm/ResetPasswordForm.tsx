import { SubmitHandler, useForm } from 'react-hook-form'
import { useLocation } from 'react-router-dom'

import styles from './ResetPasswordForm.module.scss'
import { ButtonBlue } from '../../../shared/ui/ButtonBlue/ButtonBlue'
import { useCustomToast } from '../../../shared/ui/CustomToast/CustomToast'
import { Input } from '../../../shared/ui/Input/Input'
import { postClientResetPassword } from '../../../shared/utils/api/Auth/post-client-reset-password'
import { postResidentResetPassword } from '../../../shared/utils/api/Auth/post-resident-reset-password'

interface FormFields {
  email: string
}

export const ResetPasswordForm = () => {
  const { register, handleSubmit } = useForm<FormFields>()

  const showToast = useCustomToast()
  const location = useLocation()

  const userType = location.pathname.includes('/resident/') ? 'resident' : 'client'

  const onSubmit: SubmitHandler<FormFields> = async data => {
    let response

    if (userType === 'resident') {
      response = await postResidentResetPassword(data.email)
    } else {
      response = await postClientResetPassword(data.email)
    }

    if (response.status) {
      showToast({
        title: 'Successfully',
        description: response.message,
        status: 'success',
      })
    } else {
      showToast({
        title: 'Error',
        description: response.message,
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
