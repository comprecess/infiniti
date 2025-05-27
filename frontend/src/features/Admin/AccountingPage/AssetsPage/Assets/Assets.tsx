import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { AccountingAssetsInputDataCategory } from '../../../../../app/constants/constants'
import { Routes } from '../../../../../app/router/routes'
import { ButtonBlue } from '../../../../../shared/ui/ButtonBlue/ButtonBlue'
import styles from './Assets.module.scss'
import { Item } from './Item/Item'
import { NewCategoryModal } from './NewCategoryModal/NewCategoryModal'

interface AssetsProps {
  categories: AccountingAssetsInputDataCategory[]
  filterCategory: string
  handleChangeFilterCategory: (filter: string | number) => void
  handleAddNewCategory: (name: string) => void
  handleDeleteCategory: (id: number) => void
}

export const Assets = ({
  categories,
  filterCategory,
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
        <ButtonBlue
          title='Add an Asset'
          onClick={handleNavigateToAddNewAsset}
        />
        <div className={styles.categoriesList}>
          <Item
            key='all_categories'
            id={0}
            name='All Categories'
            isActive={filterCategory === ''}
            deleteCategory={() => {}}
            onClick={() => handleChangeFilterCategory('all')}
          />
          {categories.map(category => (
            <Item
              key={category.id}
              isDeleted
              isActive={filterCategory.includes(
                `&filter[category]=${category.id}`,
              )}
              {...category}
              deleteCategory={handleDeleteCategory}
              onClick={() => handleChangeFilterCategory(category.id)}
            />
          ))}
        </div>
        <ButtonBlue
          title='New Category'
          onClick={handleOpenNewCategoryModal}
        />
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
