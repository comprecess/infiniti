import { ContactItem } from './ContactItem/ContactItem'
import styles from './Header.module.scss'
import { FullInfoClient, SalesViewOfferData } from '../../../../../app/constants/constants'
import { sanitizeMessage } from '../../../../../shared/utils/TextEditor/sanitizeMessage'
import { Status } from '../Status/Status'

interface HeaderProps {
  title: string
  invoiceCode: string
  invoiceDate: string
  dueDate: string
  status: string
  company: {
    companyAddress: string
    companyName: string
  }
  offer: SalesViewOfferData
  totalInvoice: string
  dueAmount: string
  isCredit: boolean
  client: FullInfoClient
}

export const Header = ({
  title,
  invoiceCode,
  invoiceDate,
  dueDate,
  status,
  company,
  totalInvoice,
  dueAmount,
  isCredit,
  client,
  offer,
}: HeaderProps) => {
  const safeHTMLCompanyAddress = sanitizeMessage(company.companyAddress)
  const safeHTMLProposal = sanitizeMessage(offer?.proposal)
  const safeHTMLNotes = sanitizeMessage(offer?.notes)

  return (
    <div className={styles.wrapper}>
      <section className={styles.sectionFirst}>
        <div className={styles.invoiceTitle}>
          {title && <h4 className={styles.titleInvoice}>{`${title}`}</h4>}
          <h4 className={styles.invoiceCode}>{`#${invoiceCode}`}</h4>
          <Status status={status} />
        </div>
        <div className={styles.infiniti}>
          <img src='/logoInfinitiWhite.svg' alt='infiniti' className={styles.logo} />
          <div className={styles.infinitiDescription}>
            <span
              dangerouslySetInnerHTML={{ __html: safeHTMLCompanyAddress }}
              className={styles.infinitiCompanyAddress}
            />
          </div>
        </div>
      </section>
      <section className={styles.sectionSecond}>
        <div className={styles.invoicedTo}>
          <span className={styles.invoicedToTitle}>Invoiced To:</span>
          <div className={styles.invoicedToList}>
            {client.company && <span className={styles.invoicedToItem}>{client.company}</span>}
            {client.account && (
              <span className={styles.invoicedToItem}>{`ATTN: ${client.account}`}</span>
            )}
            {client.address && <span className={styles.invoicedToItem}>{client.address}</span>}
            {client.city && <span className={styles.invoicedToItem}>{client.city}</span>}
          </div>
          <div className={styles.contactInfo}>
            {client.phone && <ContactItem title='Phone' value={client.phone} />}
            {client.email && <ContactItem title='Email' value={client.email} />}
            {client.customFields.map(field => {
              return <ContactItem key={field.id} title={field.name} value={field.value} />
            })}
          </div>
        </div>
        <div className={styles.invoiceTotal}>
          <div className={styles.invoiceDate}>
            {invoiceDate && <ContactItem title='Invoice Date' value={invoiceDate} />}
            {dueDate && <ContactItem title='Due Date' value={dueDate} />}
          </div>
          <div className={styles.totalWrapper}>
            <span className={styles.totalTitle}>Invoice Total:</span>
            <span className={styles.totalValue} contentEditable={false}>
              {totalInvoice}
            </span>
          </div>
          {isCredit && (
            <div className={styles.dueAmount}>
              <ContactItem title='Due Amount' value={dueAmount} />
            </div>
          )}
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
              className='dangerouslySetInnerHTML'
            />
          )}
          {offer.notes && (
            <span
              dangerouslySetInnerHTML={{ __html: safeHTMLNotes }}
              className='dangerouslySetInnerHTML'
            />
          )}
        </div>
      )}
    </div>
  )
}
