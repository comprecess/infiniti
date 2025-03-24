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
import { addCurrency } from '../../../../shared/utils/api/Admin/Currency/AddCurrency'
import { changeBaseCurrency } from '../../../../shared/utils/api/Admin/Currency/ChangeBaseCurrency'
import { deleteCurrency } from '../../../../shared/utils/api/Admin/Currency/DeleteCurrency'
import { editCurrency } from '../../../../shared/utils/api/Admin/Currency/EditCurrency'
import { getListOfActive } from '../../../../shared/utils/api/Admin/Currency/GetListOfActive'
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

  const getCurrencyList = async () => {
    const currencyResponse: {
      access: RolesAccess
      data: CurrencyProps[]
    } = await getListOfActive()

    setAccess(currencyResponse.access)
    setCurrenciesList(currencyResponse.data)
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
      getCurrencyList()
    } else {
      showToast({
        title: 'Error',
        description: deleteResponse.message,
        status: 'error',
      })
    }
  }

  const changeSelectedBaseCurrency = async (id: number) => {
    const changeResponse = await changeBaseCurrency(id)

    if (changeResponse.status) {
      showToast({
        title: 'Successfully',
        description: 'You have successfully changed the base currency',
        status: 'success',
      })
      getCurrencyList()
    } else {
      showToast({
        title: 'Error',
        description: changeResponse.message,
        status: 'error',
      })
    }
  }

  const editSelectedCurrency = async (id: number) => {
    const changeResponse = await editCurrency(id, name, rate)

    if (changeResponse.status) {
      showToast({
        title: 'Successfully',
        description: 'You have successfully changed the base currency',
        status: 'success',
      })
      getCurrencyList()
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
    const addResponse = await addCurrency(name, rate)

    if (addResponse.status) {
      showToast({
        title: 'Successfully',
        description: 'You have successfully added currency',
        status: 'success',
      })
      getCurrencyList()
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
    getCurrencyList()
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
