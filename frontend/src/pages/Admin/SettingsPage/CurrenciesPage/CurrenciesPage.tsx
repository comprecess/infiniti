import { useEffect, useState } from 'react'

import {
  CurrencyProps,
  RolesAccess,
} from '../../../../app/constants/constants'
import { EditCurrency } from '../../../../features/Admin/CurrenciesPage/EditCurrency/EditCurrency'
import { NewCurrency } from '../../../../features/Admin/CurrenciesPage/NewCurrency/NewCurrency'
import { RecentCurrencies } from '../../../../features/Admin/CurrenciesPage/RecentCurrencies/RecentCurrencies'
import { ButtonBlue } from '../../../../shared/ui/ButtonBlue/ButtonBlue'
import { useCustomToast } from '../../../../shared/ui/CustomToast/CustomToast'
import { LoadingSpinner } from '../../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { deleteCurrency } from '../../../../shared/utils/api/Admin/Currency/delete-currency'
import { getCurrencyList } from '../../../../shared/utils/api/Admin/Currency/get-currency-list'
import { postCreateNewCurrency } from '../../../../shared/utils/api/Admin/Currency/post-create-new-currency'
import { putChangeBaseCurrency } from '../../../../shared/utils/api/Admin/Currency/put-change-base-currency'
import { putUpdateCurrency } from '../../../../shared/utils/api/Admin/Currency/put-update-currency'
import { RecentCard } from '../../../../widgets/RecentCard/RecentCard'
import styles from './CurrenciesPage.module.scss'

export const AdminCurrenciesPage = () => {
  const [currenciesList, setCurrenciesList] = useState<
  CurrencyProps[] | null
  >(null)
  const [modalNewCurrency, setModalNewCurrency] = useState<boolean>(false)
  const [modalEditCurrency, setModalEditCurrency] =
    useState<boolean>(false)

  const [access, setAccess] = useState<RolesAccess | null>(null)

  const [id, setId] = useState<number>(0)
  const [inputValueName, setInputValueName] = useState<string>('')
  const [inputValueRate, setInputValueRate] = useState<string>('')

  const [name, setName] = useState<string>('')
  const [rate, setRate] = useState<number>(0)

  const showToast = useCustomToast()

  const handleOpenCloseModalNewCurrency = () => {
    setModalNewCurrency(!modalNewCurrency)
  }

  const handleOpenCloseModalEditCurrency = () => {
    setModalEditCurrency(!modalEditCurrency)
  }

  const handleInputChange = (name: string, value: string | number) => {
    if (name === 'currencyCode') {
      setName(value as string)
    } else if (name === 'rate') {
      setRate(Number(value))
    }
  }

  const currencyList = async () => {
    const response = await getCurrencyList()

    if (!response.status) return

    setAccess(response.data.access)
    setCurrenciesList(response.data.data)
  }

  const loadEditModalWindow = (
    id: number,
    inputValueName: string,
    inputValueRate: string,
  ) => {
    setId(id)
    setInputValueName(inputValueName)
    setInputValueRate(inputValueRate)

    setName(inputValueName)
    setRate(parseFloat(inputValueRate))

    handleOpenCloseModalEditCurrency()
  }

  const deleteSelectedCurrency = async (id: number) => {
    const deleteResponse = await deleteCurrency(id)

    if (deleteResponse.status) {
      showToast({
        title: 'Successfully',
        description: 'You have successfully deleted the currency',
        status: 'success',
      })
      currencyList()
    } else {
      showToast({
        title: 'Error',
        description: deleteResponse.message,
        status: 'error',
      })
    }
  }

  const changeSelectedBaseCurrency = async (id: number) => {
    const changeResponse = await putChangeBaseCurrency(id)

    if (changeResponse.status) {
      showToast({
        title: 'Successfully',
        description: 'You have successfully changed the base currency',
        status: 'success',
      })
      currencyList()
    } else {
      showToast({
        title: 'Error',
        description: changeResponse.message,
        status: 'error',
      })
    }
  }

  const editSelectedCurrency = async (id: number) => {
    const changeResponse = await putUpdateCurrency(id, name, rate)

    if (changeResponse.status) {
      showToast({
        title: 'Successfully',
        description: 'You have successfully changed the base currency',
        status: 'success',
      })
      currencyList()
    } else {
      showToast({
        title: 'Error',
        description: changeResponse.message,
        status: 'error',
      })
    }

    handleOpenCloseModalEditCurrency()
  }

  const createNewCurrency = async () => {
    const addResponse = await postCreateNewCurrency(name, rate)

    if (addResponse.status) {
      showToast({
        title: 'Successfully',
        description: 'You have successfully added currency',
        status: 'success',
      })
      currencyList()
    } else {
      showToast({
        title: 'Error',
        description: addResponse.message,
        status: 'error',
      })
    }

    handleOpenCloseModalNewCurrency()
  }

  useEffect(() => {
    document.title = 'infiniti | Currencies'
  }, [])

  useEffect(() => {
    currencyList()
  }, [])

  return (
    <div className={styles.wrapper}>
      <section className={styles.section}>
        {currenciesList && access ? (
          <RecentCard
            title='Currencies'
            style={styles.recentFullScreen}
            Component={access.create ? ButtonBlue : undefined}
            componentProps={
              access.create
                ? {
                  title: 'New Currency',
                  icon: '/icons/plus.svg',
                  iconProps: styles.icon,
                  onClick: handleOpenCloseModalNewCurrency,
                  style: styles.blueButton,
                }
                : undefined
            }
          >
            <RecentCurrencies
              access={access}
              currencyList={currenciesList}
              deleteCurrency={deleteSelectedCurrency}
              changeBaseCurrency={changeSelectedBaseCurrency}
              editCurrency={loadEditModalWindow}
            />
          </RecentCard>
        ) : (
          <LoadingSpinner size='xl' />
        )}
      </section>
      <NewCurrency
        modalNewCurrency={modalNewCurrency}
        handleOpenCloseModal={handleOpenCloseModalNewCurrency}
        createNewCurrency={createNewCurrency}
        handleInputChange={handleInputChange}
      />
      <EditCurrency
        id={id}
        inputValueName={inputValueName}
        inputValueRate={inputValueRate}
        modalEditCurrency={modalEditCurrency}
        handleOpenCloseModal={handleOpenCloseModalEditCurrency}
        editCurrency={editSelectedCurrency}
        handleInputChange={handleInputChange}
      />
    </div>
  )
}
