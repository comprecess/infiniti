import { FC, useState } from 'react'

import { ValuesProps } from '../../app/constants/constants'
import { ButtonBlue } from '../../shared/ui/ButtonBlue/ButtonBlue'
import { ConfirmationModal } from '../../shared/ui/ConfirmationModal/ConfirmationModal'
import { CustomMiniButton } from '../../shared/ui/CustomMiniButton/CustomMiniButton'
import { StatusProfitability } from '../../shared/ui/StatusProfitability/StatusProfitability'
import { Item } from '../TalentsCard/Body/Item/Item'
import styles from './BusinessModelCard.module.scss'

interface BusinessModelCardProps {
  id: number
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
  onMobileCLick: () => void
  onNavigate: (id: number) => void
  onDelete: (id: number) => void
  onConvert: (id: number) => void
  onEdit: (id: number) => void
}

export const BusinessModelCard: FC<BusinessModelCardProps> = ({
  id,
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
  onMobileCLick,
  onNavigate,
  onDelete,
  onConvert,
  onEdit,
}) => {
  const [modalDelete, setModalDelete] = useState<boolean>(false)

  const handleOpenConfirmationModal = () => {
    setModalDelete(state => !state)
  }

  return (
    <>
      <div
        className={`${styles.wrapper} ${isOpen ? styles.wrapperOpen : ''}`}
        onClick={onMobileCLick}
      >
        <div className={styles.businessModelImg}>
          <img src={image} alt='BusinessModelImg' />
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
                <span className={styles.keyDataDescription}>
                  {location[0].value}
                </span>
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
                    <CustomMiniButton
                      style='mint'
                      icon='/icons/view.svg'
                      tooltipTitle='View'
                      alt='View'
                      onClick={() => onNavigate(id)}
                    />
                    <CustomMiniButton
                      style='amber'
                      icon='/icons/edit.svg'
                      tooltipTitle='Edit'
                      alt='Edit'
                      onClick={() => onEdit(id)}
                    />
                    <CustomMiniButton
                      style='blue'
                      icon='/icons/fileMove.svg'
                      tooltipTitle='Convert to Business Plan'
                      alt='Convert'
                      onClick={() => onConvert(id)}
                    />
                    <CustomMiniButton
                      style='cherry'
                      icon='/icons/trash.svg'
                      tooltipTitle='Delete'
                      alt='Delete'
                      onClick={handleOpenConfirmationModal}
                    />
                  </div>
                )}
                {!isAdmin && (
                  <ButtonBlue
                    title='Details'
                    onClick={() => onNavigate(id)}
                  />
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
    </>
  )
}
