import { FC, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import {
  FullInfoClient,
  SalesViewInvoicePayList,
  SalesViewOfferData,
} from '../../../../app/constants/constants'
import { Routes } from '../../../../app/router/routes'
import { ButtonBlue } from '../../../../shared/ui/ButtonBlue/ButtonBlue'
import { CreditCardInput } from '../../../../shared/ui/CreditCardInput/CreditCardInput'
import { CustomSelect } from '../../../../shared/ui/CustomSelect/CustomSelect'
import { sanitizeMessage } from '../../../../shared/utils/TextEditor/sanitizeMessage'
import { ContactItem } from '../../../Admin/Sales/ViewInvoice/Header/ContactItem/ContactItem'
import { Status } from '../../../Admin/Sales/ViewInvoice/Status/Status'
import styles from './Header.module.scss'

interface HeaderProps {
  token: string | null
  title: string
  invoiceCode: string
  invoiceDate: string
  dueDate: string
  status: string
  checkPublic: boolean
  company: {
    companyAddress: string
    companyName: string
  }
  totalInvoice: string
  client: FullInfoClient
  offer: SalesViewOfferData
  payList?: SalesViewInvoicePayList[]
  postTokenStripeSend: (token: string) => void
}

export const Header: FC<HeaderProps> = ({
  title,
  invoiceCode,
  invoiceDate,
  dueDate,
  status,
  checkPublic,
  company,
  totalInvoice,
  client,
  offer,
  payList,
  token,
  postTokenStripeSend,
}) => {
  const [creditCard, setCreditCard] = useState<boolean>(false)

  const [payNow, setPayNow] = useState<
  SalesViewInvoicePayList | undefined
  >(undefined)

  const navigate = useNavigate()

  const safeHTMLCompanyAddress = sanitizeMessage(company.companyAddress)
  const safeHTMLProposal = sanitizeMessage(offer?.proposal)
  const safeHTMLNotes = sanitizeMessage(offer?.notes)

  const handleChangePayNow = (_name: string, value: number) => {
    setPayNow(payList?.find(item => item.id === value))
  }

  const handlePayNow = () => {
    if (payNow?.idName === 'stripe') {
      setCreditCard(true)
    } else {
      navigate(
        `/${Routes.public}/${Routes.invoice}/${Routes.proof}/${Routes.transaction}/${token}`,
      )
      setCreditCard(false)
    }
  }

  return (
    <div className={styles.wrapper}>
      <section className={styles.sectionFirst}>
        <div className={styles.invoiceTitle}>
          {title && <h4 className={styles.titleInvoice}>{`${title}`}</h4>}
          <h4 className={styles.invoiceCode}>{`#${invoiceCode}`}</h4>
          <Status status={status} />
        </div>
        <div className={styles.infiniti}>
          <img
            src='/logoInfinitiWhite.svg'
            alt='Logo'
            className={styles.logo}
          />
          <div className={styles.infinitiDescription}>
            <span
              dangerouslySetInnerHTML={{
                __html: safeHTMLCompanyAddress,
              }}
              className={styles.infinitiCompanyAddress}
            />
          </div>
        </div>
      </section>
      <section className={styles.sectionSecond}>
        <div className={styles.invoicedTo}>
          <span className={styles.invoicedToTitle}>Invoiced To:</span>
          {!checkPublic ? (
            <>
              <div className={styles.invoicedToList}>
                {client.company && (
                  <span className={styles.invoicedToItem}>
                    {client.company}
                  </span>
                )}
                {client.account && (
                  <span className={styles.invoicedToItem}>
                    {`ATTN: ${client.account}`}
                  </span>
                )}
                {client.address && (
                  <span className={styles.invoicedToItem}>
                    {client.address}
                  </span>
                )}
                {client.city && (
                  <span className={styles.invoicedToItem}>
                    {client.city}
                  </span>
                )}
              </div>
              <div className={styles.contactInfo}>
                {client.phone && (
                  <ContactItem title='Phone' value={client.phone} />
                )}
                {client.email && (
                  <ContactItem title='Email' value={client.email} />
                )}
                {client.customFields.map(field => {
                  return (
                    <ContactItem
                      key={field.id}
                      title={field.name}
                      value={field.value}
                    />
                  )
                })}
              </div>
            </>
          ) : (
            <span className={styles.hiddenInfo}>Hidden</span>
          )}
        </div>
        <div className={styles.invoiceWrapper}>
          <div className={styles.invoiceTotal}>
            <div className={styles.invoiceDate}>
              {invoiceDate && (
                <ContactItem title='Invoice Date' value={invoiceDate} />
              )}
              {dueDate && <ContactItem title='Due Date' value={dueDate} />}
            </div>
            <div className={styles.totalWrapper}>
              <span className={styles.totalTitle}>Invoice Total:</span>
              <span className={styles.totalValue} contentEditable={false}>
                {totalInvoice}
              </span>
            </div>
          </div>
          <div className={styles.payContainer}>
            {payList && (
              <div style={{ width: '100%' }}>
                <CustomSelect
                  idList={payList.map(item => item.id)}
                  nameList={payList.map(item => item.name)}
                  value={payList[0].id}
                  onChange={handleChangePayNow}
                />
              </div>
            )}
            <ButtonBlue
              titleNone
              title='Pay Now'
              icon='/icons/cardWhite.svg'
              iconProps={styles.iconPay}
              style={styles.buttonPay}
              onClick={handlePayNow}
            />
            {creditCard && (
              <CreditCardInput postTokenStripeSend={postTokenStripeSend} />
            )}
          </div>
        </div>
      </section>
      {offer && (
        <div className={styles.invoicedTo}>
          <span className={styles.invoicedToTitle}>
            {`Offer: 
            ${offer.code}`}
          </span>
          {offer.proposal && (
            <span
              dangerouslySetInnerHTML={{ __html: safeHTMLProposal }}
              className={styles.offerProposal}
            />
          )}
          {offer.notes && (
            <span
              dangerouslySetInnerHTML={{ __html: safeHTMLNotes }}
              className={styles.offerNotes}
            />
          )}
        </div>
      )}
    </div>
  )
}
