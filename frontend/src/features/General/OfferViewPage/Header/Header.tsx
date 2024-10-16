import { FC } from 'react'

import { FullInfoClient } from '../../../../app/constants/constants'
import { sanitizeMessage } from '../../../../shared/utils/TextEditor/sanitizeMessage'
import { ContactItem } from '../../../Admin/Sales/ViewInvoice/Header/ContactItem/ContactItem'
import { Status } from '../../../Admin/Sales/ViewInvoice/Status/Status'
import styles from './Header.module.scss'

interface HeaderProps {
  title: string
  code: string
  dateCreated: string
  expiryDate: string
  stage: string
  checkPublic: boolean
  company: {
    companyAddress: string
    companyName: string
  }
  total: string
  proposal: string
  client: FullInfoClient
}

export const Header: FC<HeaderProps> = ({
  title,
  code,
  dateCreated,
  expiryDate,
  stage,
  checkPublic,
  company,
  total,
  proposal,
  client,
}) => {
  const safeHTMLCompanyAddress = sanitizeMessage(company.companyAddress)
  const safeHTMLProposal = sanitizeMessage(proposal)

  return (
    <div className={styles.wrapper}>
      <section className={styles.sectionFirst}>
        <div className={styles.offerTitle}>
          {title && <h4 className={styles.titleOffer}>{`${title}`}</h4>}
          <h4 className={styles.offerCode}>{`#${code}`}</h4>
          <Status status={stage} />
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
        <div className={styles.offerTo}>
          <span className={styles.offerToTitle}>Recipient:</span>
          {!checkPublic ? (
            <>
              <div className={styles.offerToList}>
                {client.company && (
                  <span className={styles.offerToItem}>{client.company}</span>
                )}
                {client.account && (
                  <span className={styles.offerToItem}>
                    {`ATTN: ${client.account}`}
                  </span>
                )}
                {client.address && (
                  <span className={styles.offerToItem}>{client.address}</span>
                )}
                {client.city && (
                  <span className={styles.offerToItem}>{client.city}</span>
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
        <div className={styles.offerTotal}>
          <div className={styles.offerDate}>
            {dateCreated && (
              <ContactItem title='Date Created' value={dateCreated} />
            )}
            {expiryDate && (
              <ContactItem title='Expiry Date' value={expiryDate} />
            )}
          </div>
          <div className={styles.totalWrapper}>
            <span className={styles.totalTitle}>Total:</span>
            <span className={styles.totalValue} contentEditable={false}>
              {total}
            </span>
          </div>
        </div>
      </section>
      {proposal && (
        <div className={styles.offerTo}>
          <span className={styles.offerToTitle}>Proposal Text:</span>
          <span
            dangerouslySetInnerHTML={{
              __html: safeHTMLProposal,
            }}
            className={styles.message}
          />
        </div>
      )}
    </div>
  )
}
