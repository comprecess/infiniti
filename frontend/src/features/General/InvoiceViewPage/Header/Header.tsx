import { FC } from 'react'

import {
  FullInfoClient,
  SalesViewOfferData,
} from '../../../../app/constants/constants'
import { sanitizeMessage } from '../../../../shared/utils/TextEditor/sanitizeMessage'
import { ContactItem } from '../../../Admin/Sales/ViewInvoice/Header/ContactItem/ContactItem'
import { Status } from '../../../Admin/Sales/ViewInvoice/Status/Status'
import styles from './Header.module.scss'

interface HeaderProps {
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
}) => {
  const safeHTMLCompanyAddress = sanitizeMessage(company.companyAddress)
  const safeHTMLProposal = sanitizeMessage(offer.proposal)
  const safeHTMLNotes = sanitizeMessage(offer.notes)

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
            src='/logoInfiniti.svg'
            alt='Logo'
            className={styles.logo}
          />
          <div className={styles.infinitiDescription}>
            <span className={styles.infinitiCompanyName}>
              {company.companyName}
            </span>
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
      </section>
      {offer && (
        <div className={styles.invoicedTo}>
          <span className={styles.invoicedToTitle}>
            {`Offer: 
            ${offer.id}`}
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
