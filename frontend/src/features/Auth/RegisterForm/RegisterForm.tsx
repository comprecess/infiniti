import { FC } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import { Routes } from '../../../app/router/routes'
import { ButtonBlue } from '../../../shared/ui/ButtonBlue/ButtonBlue'
import { useCustomToast } from '../../../shared/ui/CustomToast/CustomToast'
import { Input } from '../../../shared/ui/Input/Input'
import { registerUser } from '../../../shared/utils/api/Auth/Register'
import styles from './RegisterForm.module.scss'

interface FormFields {
  userName: string
  email: string
  password: string
  confirmPassword: string
}

export const RegisterForm: FC = () => {
  const { register, handleSubmit, watch } = useForm<FormFields>()

  const navigate = useNavigate()
  const showToast = useCustomToast()

  const onSubmit: SubmitHandler<FormFields> = async data => {
    const registerResponse = await registerUser(
      data.userName,
      data.email,
      data.password,
      data.confirmPassword,
    )

    if (registerResponse.status) {
      showToast({
        title: 'Successfully',
        description: registerResponse.message,
        status: 'success',
      })

      navigate(`/${Routes.clientPages}/${Routes.dashboard}`)
    } else {
      showToast({
        title: 'Error',
        description: registerResponse.message,
        status: 'error',
      })
    }
  }

  return (
    <div className={styles.wrapper}>
      <form className={styles.items} onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.inputs}>
          <Input
            title='Full Name'
            id='userName'
            name='userName'
            type='text'
            register={register}
            validationRules={{ required: true }}
          />
          <Input
            title='Email'
            placeholder='example@email.com'
            id='email'
            name='email'
            type='email'
            register={register}
            validationRules={{ required: true }}
          />
          <Input
            title='Password'
            id='password'
            name='password'
            type='password'
            register={register}
            validationRules={{ required: true }}
          />
          <Input
            title='Confirm Password'
            id='confirmPassword'
            name='confirmPassword'
            type='password'
            register={register}
            validationRules={{
              required: true,
              validate: value =>
                value === watch('password') ||
                'The passwords do not match',
            }}
          />
        </div>
        <ButtonBlue title='Register' type='submit' />
      </form>
    </div>
  )
}
