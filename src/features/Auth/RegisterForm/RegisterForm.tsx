import { FC } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import { ButtonBlue } from '../../../shared/ui/ButtonBlue/ButtonBlue'
import { Input } from '../../../shared/ui/Input/Input'
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

  const onSubmit: SubmitHandler<FormFields> = data => {
    navigate('/')
    console.log('Success Register:', data)
  }

  return (
    <div className={styles.wrapper}>
      <form className={styles.items} onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.inputs}>
          <Input
            title='Full Name'
            id='username'
            name='username'
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
