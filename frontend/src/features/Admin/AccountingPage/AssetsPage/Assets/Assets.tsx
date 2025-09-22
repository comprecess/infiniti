import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import styles from './Assets.module.scss'
import { Item } from './Item/Item'
import { NewCategoryModal } from './NewCategoryModal/NewCategoryModal'
import {
  AccountingAssetsInputDataCategory,
  RolesAccess,
} from '../../../../../app/constants/constants'
import { Routes } from '../../../../../app/router/routes'
import { ButtonBlue } from '../../../../../shared/ui/ButtonBlue/ButtonBlue'

interface AssetsProps {
  categories: AccountingAssetsInputDataCategory[]
  filterCategory: string
  access: RolesAccess
  handleChangeFilterCategory: (filter: string | number) => void
  handleAddNewCategory: (name: string) => void
  handleDeleteCategory: (id: number) => void
}

export const Assets = ({
  categories,
  filterCategory,
  access,
  handleChangeFilterCategory,
  handleAddNewCategory,
  handleDeleteCategory,
}: AssetsProps) => {
  const [modalNewCategory, setModalNewCategory] = useState<boolean>(false)

  const navigate = useNavigate()

  const handleOpenNewCategoryModal = () => {
    setModalNewCategory(state => !state)
  }

  const handleNavigateToAddNewAsset = () => {
    navigate(
      `/${Routes.adminPages}/${Routes.accounting}/${Routes.assets}/${Routes.add}/${Routes.new}/${Routes.asset}`,
    )
  }

  return (
    <>
      <div className={styles.wrapper}>
        {access.create === 1 && (
          <ButtonBlue
            title='Add an Asset'
            onClick={handleNavigateToAddNewAsset}
          />
        )}
        <div className={styles.categoriesList}>
          <Item
            key='all_categories'
            id={0}
            name='All Categories'
            access={access}
            isActive={filterCategory === ''}
            deleteCategory={() => {}}
            onClick={() => handleChangeFilterCategory('all')}
          />
          {categories.map(category => (
            <Item
              key={category.id}
              isDeleted
              access={access}
              isActive={filterCategory.includes(
                `&filter[category]=${category.id}`,
              )}
              {...category}
              deleteCategory={handleDeleteCategory}
              onClick={() => handleChangeFilterCategory(category.id)}
            />
          ))}
        </div>
        {access.create === 1 && (
          <ButtonBlue
            title='New Category'
            onClick={handleOpenNewCategoryModal}
          />
        )}
      </div>
      {modalNewCategory && (
        <NewCategoryModal
          isOpen={modalNewCategory}
          addNewCategory={handleAddNewCategory}
          onClose={handleOpenNewCategoryModal}
        />
      )}
    </>
  )
}
