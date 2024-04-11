import { FC } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import { IconText } from '../../../shared/ui/IconText/IconText'
import { Input } from '../../../shared/ui/Input/Input'
import { SubmitButton } from '../../../shared/ui/SubmitButton/SubmitButton'
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

  const onSubmit: SubmitHandler<FormFields> = data => {
    if (resident) {
      console.log('Success Resident Login:', data)
    } else {
      console.log('Success SignIn:', data)
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
        <SubmitButton
          title={resident ? 'Login' : 'Sign In'}
          type='submit'
        />
      </form>
    </div>
  )
}
