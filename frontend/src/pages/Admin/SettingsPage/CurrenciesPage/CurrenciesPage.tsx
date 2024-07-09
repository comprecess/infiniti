import { FC, useEffect, useState } from 'react'

import { CurrencyProps } from '../../../../app/constants/constants'
import { RecentCurrencies } from '../../../../features/Admin/CurrenciesPage/RecentCurrencies/RecentCurrencies'
import { ButtonBlue } from '../../../../shared/ui/ButtonBlue/ButtonBlue'
import { useCustomToast } from '../../../../shared/ui/CustomToast/CustomToast'
import { LoadingSpinner } from '../../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { addCurrency } from '../../../../shared/utils/api/Currency/AddCurrency'
import { changeBaseCurrency } from '../../../../shared/utils/api/Currency/ChangeBaseCurrency'
import { deleteCurrency } from '../../../../shared/utils/api/Currency/DeleteCurrency'
import { editCurrency } from '../../../../shared/utils/api/Currency/EditCurrency'
import { getListOfActive } from '../../../../shared/utils/api/Currency/GetListOfActive'
import { RecentCard } from '../../../../widgets/RecentCard/RecentCard'
import styles from './CurrenciesPage.module.scss'
import { EditCurrency } from './EditCurrency/EditCurrency'
import { NewCurrency } from './NewCurrency/NewCurrency'

export const AdminCurrenciesPage: FC = () => {
  const [currenciesList, setCurrenciesList] = useState<
    CurrencyProps[] | null
  >(null)
  const [modalNewCurrency, setModalNewCurrency] = useState<boolean>(false)
  const [modalEditCurrency, setModalEditCurrency] =
    useState<boolean>(false)

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
    } else if (name === 'baseConversionRate') {
      setRate(Number(value))
    }
  }

  const getCurrencyList = async () => {
    const currencyResponse: CurrencyProps[] = await getListOfActive()

    setCurrenciesList(currencyResponse)
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

    if (deleteResponse) {
      showToast({
        title: 'Successfully',
        description: 'You have successfully deleted the currency',
        status: 'success',
      })
      getCurrencyList()
    } else {
      showToast({
        title: 'Error',
        description: 'Error when deleting currency',
        status: 'error',
      })
    }
  }

  const changeSelectedBaseCurrency = async (id: number) => {
    const changeResponse = await changeBaseCurrency(id)

    if (changeResponse) {
      showToast({
        title: 'Successfully',
        description: 'You have successfully changed the base currency',
        status: 'success',
      })
      getCurrencyList()
    } else {
      showToast({
        title: 'Error',
        description: 'Error when changing base currency',
        status: 'error',
      })
    }
  }

  const editSelectedCurrency = async (id: number) => {
    const changeResponse = await editCurrency(id, name, rate)

    if (changeResponse) {
      showToast({
        title: 'Successfully',
        description: 'You have successfully changed the base currency',
        status: 'success',
      })
      getCurrencyList()
    } else {
      showToast({
        title: 'Error',
        description: 'Error when changing base currency',
        status: 'error',
      })
    }

    handleOpenCloseModalEditCurrency()
  }

  const createNewCurrency = async () => {
    const addResponse = await addCurrency(name, rate)

    if (addResponse) {
      showToast({
        title: 'Successfully',
        description: 'You have successfully added currency',
        status: 'success',
      })
      getCurrencyList()
    } else {
      showToast({
        title: 'Error',
        description: 'Error adding currency',
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
        {currenciesList ? (
          <RecentCard
            title='Currencies'
            style={styles.recentFullScreen}
            Component={ButtonBlue}
            componentProps={{
              title: 'New Currency',
              icon: '/icons/plus.svg',
              iconProps: styles.icon,
              onClick: handleOpenCloseModalNewCurrency,
              style: styles.blueButton,
            }}
          >
            <RecentCurrencies
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
