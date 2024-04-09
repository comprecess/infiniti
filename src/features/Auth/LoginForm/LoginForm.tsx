import { FC } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import { IconText } from '../../../shared/ui/IconText/IconText'
import { Input } from '../../../shared/ui/Input/Input'
import styles from './LoginForm.module.scss'

type FormFields = [email: string, password: string]

export const LoginForm: FC = () => {
  const { register, handleSubmit } = useForm<FormFields>()

  const navigate = useNavigate()

  const onSubmit: SubmitHandler<FormFields> = data => {
    console.log('Login:', data)
  }

  return (
    <div className={styles.wrapper}>
      <form className={styles.inputs} onSubmit={handleSubmit(onSubmit)}>
        <Input
          title='Email'
          placeholder='example@email.com'
          id='email'
          name='email'
          type='email'
          register={register}
          validationRules={{ required: true }}
        />
        <div className={styles.items}>
          <Input
            title='Password'
            id='password'
            name='password'
            type='password'
            register={register}
            validationRules={{ required: true }}
          />
          <div className={styles.forgotPassword}>
            <IconText
              icon='/icons/info.svg'
              text='Forgot password?'
              styleText={styles.forgotText}
              onClick={() => navigate('/auth/forgotPassword')}
            />
          </div>
        </div>
        <button className={styles.buttonSubmit} type='submit'>
          Sign In
        </button>
      </form>
    </div>
  )
}
