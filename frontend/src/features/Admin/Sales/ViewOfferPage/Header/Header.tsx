import { FC } from 'react'

import { FullInfoClient } from '../../../../../app/constants/constants'
import { sanitizeMessage } from '../../../../../shared/utils/TextEditor/sanitizeMessage'
import { ContactItem } from '../../ViewInvoice/Header/ContactItem/ContactItem'
import { Status } from '../../ViewInvoice/Status/Status'
import styles from './Header.module.scss'

interface HeaderProps {
  subject: string
  offerCode: string
  dateCreated: string
  validUntil: string
  stage: string
  company: {
    companyAddress: string
    companyName: string
  }
  totalOffer: string
  proposal: string
  client: FullInfoClient
}

export const Header: FC<HeaderProps> = ({
  subject,
  offerCode,
  stage,
  company,
  client,
  dateCreated,
  validUntil,
  totalOffer,
  proposal,
}) => {
  const safeHTMLCompanyAddress = sanitizeMessage(company.companyAddress)
  const safeHTMLProposal = sanitizeMessage(proposal)

  return (
    <div className={styles.wrapper}>
      <section className={styles.sectionFirst}>
        <div className={styles.offerTitle}>
          {subject && <h4 className={styles.titleOffer}>{`${subject}`}</h4>}
          <h4 className={styles.offerCode}>{`#${offerCode}`}</h4>
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
            {client.phone && <ContactItem title='Phone' value={client.phone} />}
            {client.email && <ContactItem title='Email' value={client.email} />}
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
        </div>
        <div className={styles.offerTotal}>
          <div className={styles.offerDate}>
            {dateCreated && (
              <ContactItem title='Date Created' value={dateCreated} />
            )}
            {validUntil && (
              <ContactItem title='Expiry Date' value={validUntil} />
            )}
          </div>
          <div className={styles.totalWrapper}>
            <span className={styles.totalTitle}>Total:</span>
            <span className={styles.totalValue} contentEditable={false}>
              {totalOffer}
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
