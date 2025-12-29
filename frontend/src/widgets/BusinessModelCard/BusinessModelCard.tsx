import { useState } from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom'

import styles from './BusinessModelCard.module.scss'
import { ConvertModal } from './ConvertModal/ConvertModal'
import { RolesAccess, ValuesProps } from '../../app/constants/constants'
import { Routes } from '../../app/router/routes'
import { Block } from '../../features/General/Survey/types'
import { ButtonBlue } from '../../shared/ui/ButtonBlue/ButtonBlue'
import { ConfirmationModal } from '../../shared/ui/ConfirmationModal/ConfirmationModal'
import { CustomMiniButton } from '../../shared/ui/CustomMiniButton/CustomMiniButton'
import { useCustomToast } from '../../shared/ui/CustomToast/CustomToast'
import { StatusProfitability } from '../../shared/ui/StatusProfitability/StatusProfitability'
import { postSubmitSurvey } from '../../shared/utils/api/Client/BusinessPlan/post-submit-survey'
import { generateStorageKey } from '../../shared/utils/usefulMethods'
import { Item } from '../TalentsCard/Body/Item/Item'

interface BusinessModelCardProps {
  id: number
  survey: Block[] | null
  title: string
  image: string
  isAdmin: boolean
  description: string
  price: string
  industries: ValuesProps[]
  technologies: ValuesProps[]
  profitability: string
  location: ValuesProps[]
  isOpen: boolean
  access?: RolesAccess | undefined
  token: string
  onMobileCLick: () => void
  onNavigate: (id: number) => void
  onDelete: (id: number) => void
  onEdit: (id: number) => void
}

export const BusinessModelCard = ({
  id,
  survey,
  title,
  image,
  isAdmin,
  description,
  industries,
  technologies,
  price,
  location,
  profitability,
  isOpen,
  access,
  token,
  onMobileCLick,
  onNavigate,
  onDelete,
  onEdit,
}: BusinessModelCardProps) => {
  const [modalDelete, setModalDelete] = useState<boolean>(false)
  const [modalConvert, setModalConvert] = useState<boolean>(false)

  const showToast = useCustomToast()
  const navigate = useNavigate()

  const { openSurvey } = useOutletContext<{
    openSurvey: (
      questions: Block[],
      isBlur: boolean,
      localStorageKey: string,
      onSubmit?: (answers: Record<number, string | string[]>) => void,
    ) => void
  }>()

  const handleOpenConfirmationModal = () => {
    setModalDelete(state => !state)
  }

  const handleOpenConvertModal = () => {
    setModalConvert(state => !state)
  }

  const handleNavigateToPreview = () => {
    const url = `/${Routes.public}/${Routes.view}/${Routes.businessModel}/${token}`

    window.open(url, '_blank')
  }

  const handleSurveySubmit = async (answers: Record<number, string | string[]>) => {
    const { status, message } = await postSubmitSurvey(answers, id)

    if (status) {
      showToast({
        title: 'Successfully',
        description: 'You have successfully completed the Survey',
        status: 'success',
      })
      navigate(`/${Routes.clientPages}/${Routes.businessPlan}/${Routes.businessPlans}`)
    } else {
      showToast({
        title: 'Error',
        description: message,
        status: 'error',
      })
    }
  }

  return (
    <>
      <div
        className={`${styles.wrapper} ${isOpen ? styles.wrapperOpen : ''}`}
        onClick={onMobileCLick}
      >
        <div className={styles.businessModelImg}>
          <img
            src={image}
            alt='BusinessModelImg'
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
        <div className={styles.titleWrapper}>
          <div className={styles.container}>
            <div className={styles.profitability}>
              <StatusProfitability profitability={profitability} />
            </div>
            <div className={styles.titleKeyData}>
              <span className={styles.title}>{title}</span>
              <div className={styles.keyData}>
                <span className={styles.keyDataDescription}>{price}</span>
                <div className={styles.containerEllipse}>
                  <div className={styles.ellipse} />
                </div>
                <span className={styles.keyDataDescription}>{location[0].value}</span>
              </div>
            </div>
            <div className={styles.otherInfo}>
              <div className={styles.otherInfoContainer}>
                <span className={styles.description}>{description}</span>
                <div className={styles.tags}>
                  <Item title='Industries' tags={industries} />
                  <Item title='Technologies' tags={technologies} />
                </div>
                {isAdmin && (
                  <div className={styles.buttons}>
                    {access && access.view === 1 && (
                      <CustomMiniButton
                        style='mint'
                        icon='/icons/view.svg'
                        tooltipTitle='View'
                        alt='View'
                        onClick={() => onNavigate(id)}
                      />
                    )}
                    <CustomMiniButton
                      style='gray'
                      icon='/icons/fileWhite.svg'
                      tooltipTitle='Preview'
                      alt='Preview'
                      onClick={handleNavigateToPreview}
                    />
                    {access && access.edit === 1 && (
                      <CustomMiniButton
                        style='amber'
                        icon='/icons/edit.svg'
                        tooltipTitle='Edit'
                        alt='Edit'
                        onClick={() => onEdit(id)}
                      />
                    )}
                    {access && access.create === 1 && (
                      <CustomMiniButton
                        style='blue'
                        icon='/icons/fileMove.svg'
                        tooltipTitle='Convert to Business Plan'
                        alt='Convert'
                        onClick={handleOpenConvertModal}
                      />
                    )}
                    {access && access.delete === 1 && (
                      <CustomMiniButton
                        style='cherry'
                        icon='/icons/trash.svg'
                        tooltipTitle='Delete'
                        alt='Delete'
                        onClick={handleOpenConfirmationModal}
                      />
                    )}
                  </div>
                )}
                {!isAdmin && survey && (
                  <div className={styles.buttonsClient}>
                    <ButtonBlue
                      title='Convert to Plan'
                      style={styles.button}
                      onClick={() =>
                        openSurvey(
                          survey,
                          false,
                          generateStorageKey(`business_plan-${id}`),
                          handleSurveySubmit,
                        )
                      }
                    />
                    <ButtonBlue
                      title='Details'
                      style={styles.button}
                      onClick={() => onNavigate(id)}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {modalDelete && (
        <ConfirmationModal
          isOpened={modalDelete}
          handleOpenCloseModal={handleOpenConfirmationModal}
          agree={() => onDelete(id)}
        />
      )}
      {modalConvert && (
        <ConvertModal
          id={id}
          isOpened={modalConvert}
          handleOpenCloseModal={handleOpenConvertModal}
        />
      )}
    </>
  )
}
