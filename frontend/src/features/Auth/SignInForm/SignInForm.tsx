import { FC } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import { Routes } from '../../../app/router/routes'
import { ButtonBlue } from '../../../shared/ui/ButtonBlue/ButtonBlue'
import { IconText } from '../../../shared/ui/IconText/IconText'
import { Input } from '../../../shared/ui/Input/Input'
import styles from './SignInForm.module.scss'

interface FormFields {
  email: string
  password: string
}

interface SignInFormProps {
  resident?: boolean
}

export const SignInForm: FC<SignInFormProps> = ({ resident }) => {
  const { register, handleSubmit } = useForm<FormFields>()

  const navigate = useNavigate()

  const onSubmit: SubmitHandler<FormFields> = async data => {
    if (resident) {
      /* const loginResidentResponse = await loginResident(
        data.email,
        data.password,
      )

      console.log(loginResidentResponse) */

      navigate('/' + Routes.adminPages)
    } else {
      /* const loginUserResponse = await loginUser(data.email, data.password)

      console.log(loginUserResponse) */

      navigate('/' + Routes.clientPages)
    }
  }

  return (
    <div className={styles.wrapper}>
      <form className={styles.items} onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.inputs}>
          <Input
            title='Email'
            placeholder='example@email.com'
            id='email'
            name='email'
            type='email'
            register={register}
            validationRules={{ required: true }}
          />
          <div className={styles.inputIcon}>
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
                icon='/icons/infoBlue.svg'
                text='Forgot password?'
                styleText={styles.forgotText}
                onClick={() => navigate('/auth/resetpassword')}
              />
            </div>
          </div>
        </div>
        <ButtonBlue title={resident ? 'Login' : 'Sign In'} type='submit' />
      </form>
    </div>
  )
}
