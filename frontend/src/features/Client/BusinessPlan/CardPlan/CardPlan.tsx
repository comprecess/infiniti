import { useNavigate } from 'react-router-dom'

import styles from './CardPlan.module.scss'
import { Routes } from '../../../../app/router/routes'
import { ButtonBlue } from '../../../../shared/ui/ButtonBlue/ButtonBlue'
import { useCustomToast } from '../../../../shared/ui/CustomToast/CustomToast'
import { postAddBusinessPlanToCart } from '../../../../shared/utils/api/Client/BusinessPlan/post-add-business-plan-to-cart'
import { sanitizeMessage } from '../../../../shared/utils/TextEditor/sanitizeMessage'

interface CardPlanProps {
  id: number
  title: string
  description: string
  picture: string
  token: string
}

export const CardPlan = ({ id, title, description, picture, token }: CardPlanProps) => {
  const navigate = useNavigate()
  const showToast = useCustomToast()

  const safeHTML = sanitizeMessage(description)

  const handleAddToOrder = async () => {
    const { status, message } = await postAddBusinessPlanToCart(id)

    if (status) {
      showToast({
        title: 'Successfully',
        description: 'You have successfully added the Business Plan to your cart',
        status: 'success',
      })
    } else {
      showToast({
        title: 'Error',
        description: message,
        status: 'error',
      })
    }
  }

  const handleNavigateToPreview = () => {
    const url = `/${Routes.public}/${Routes.view}/${Routes.businessPlan}/${token}`

    window.open(url, '_blank')
  }

  const handleNavigateToDetails = () => {
    navigate(
      `/${Routes.clientPages}/${Routes.businessPlans}/${Routes.businessPlan}/${Routes.view}/${id}`,
    )
  }

  return (
    <div className={styles.wrapper}>
      <img src={picture ?? '/businessPlan.jpeg'} alt='Logo' className={styles.logo} />
      <div className={styles.content}>
        <div className={styles.texts}>
          <span className={styles.title}>{title}</span>
          <span
            dangerouslySetInnerHTML={{ __html: safeHTML }}
            className='dangerouslySetInnerHTML'
          />
        </div>
        <div className={styles.buttons}>
          <div className={styles.buttonsContainer}>
            <ButtonBlue title='Add to Order' style={styles.button} onClick={handleAddToOrder} />
            <ButtonBlue title='Details' style={styles.button} onClick={handleNavigateToDetails} />
          </div>
          <ButtonBlue
            title='Preview'
            style={styles.buttonPreview}
            onClick={handleNavigateToPreview}
          />
        </div>
      </div>
    </div>
  )
}
