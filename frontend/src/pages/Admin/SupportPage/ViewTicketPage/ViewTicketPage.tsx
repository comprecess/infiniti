import styles from './ViewTicketPage.module.scss'
import { dataTicket } from '../../../../app/data/test'
import { InfoItem } from '../../../../features/Admin/CustomersPage/ViewPage/Pages/SummaryPage/InfoItem/InfoItem'
import { Message } from '../../../../features/Client/ViewTicketPage/Message/Message'
import { TitlePage } from '../../../../features/Main/TitlePage/TitlePage'
import { BackButton } from '../../../../shared/ui/BackButton/BackButton'
import { ButtonBlue } from '../../../../shared/ui/ButtonBlue/ButtonBlue'
import { CustomDivider } from '../../../../shared/ui/CustomDivider/CustomDivider'
import { CustomInput } from '../../../../shared/ui/CustomInput/CustomInput'
import { CustomSelect } from '../../../../shared/ui/CustomSelect/CustomSelect'
import { Status } from '../../../../shared/ui/Status/Status'
import { TextEditor } from '../../../../shared/ui/TextEditor/TextEditor'
import { useIdFromUrl } from '../../../../shared/utils/usefulMethods'
import { RecentCard } from '../../../../widgets/RecentCard/RecentCard'

export const AdminViewTicketPage = () => {
  const id = useIdFromUrl('ticket')

  const data = dataTicket[id || 0]

  return (
    <div className={styles.wrapper}>
      <section className={styles.section}>
        <div className={styles.content}>
          <div className={styles.backButton}>
            <BackButton />
          </div>
          <div className={styles.titleWrapper}>
            <div className={styles.title}>
              <TitlePage title={data.title} />
            </div>
            <Status title={data.status} status={data.status} />
          </div>
          <section className={styles.container}>
            <RecentCard style={styles.cardFirst}>
              <div className={styles.cardFirstContent}>
                <div className={styles.cardFirstHeader}>
                  <InfoItem title='Ticket' value={data.code} />
                  <InfoItem title='Priority' ValueComponent={<div>-medium-</div>} />
                  <InfoItem title='Customer' value={data.account.name} />
                </div>
                <CustomDivider />
                <div className={styles.fields}>
                  <CustomSelect
                    title='Department'
                    titleOnChange='department'
                    idList={[]}
                    nameList={[]}
                    onChange={() => {}}
                  />
                  <CustomSelect
                    title='Assigned to'
                    titleOnChange='assigned'
                    idList={[]}
                    nameList={[]}
                    onChange={() => {}}
                  />
                  <CustomSelect
                    title='Status'
                    titleOnChange='status'
                    idList={[]}
                    nameList={[]}
                    onChange={() => {}}
                  />
                  <CustomInput
                    title='Email'
                    type='text'
                    id='email'
                    name='email'
                    onChange={() => {}}
                  />
                  <CustomInput
                    title='Cc'
                    type='text'
                    id='cc'
                    name='cc'
                    onChange={() => {}}
                  />
                  <CustomInput
                    title='Bcc'
                    type='text'
                    id='bcc'
                    name='bcc'
                    onChange={() => {}}
                  />
                  <CustomInput
                    title='Phone'
                    type='text'
                    id='phone'
                    name='phone'
                    onChange={() => {}}
                  />
                  <div className={styles.containerItems}>
                    <span className={styles.containerItemsTitle}>Note</span>
                    <TextEditor fieldName='note' setValue={() => {}} />
                  </div>
                  <ButtonBlue title='Save' style={styles.buttonSave} />
                </div>
              </div>
            </RecentCard>
            <div className={styles.cardSecond}>
              <div className={styles.tickets}>
                {data.tickets.map((ticket, index) => {
                  return (
                    <Message
                      key={ticket.id}
                      isAdmin
                      isWriteMessage={false}
                      isLast={index === data.tickets.length - 1}
                      data={ticket}
                      status={data.status}
                      isNextWriteMessage={
                        data.status === 'Open' && index === data.tickets.length - 1
                      }
                    />
                  )
                })}
                <Message
                  key='write-message'
                  isAdmin
                  isWriteMessage
                  status={data.status}
                />
              </div>
            </div>
          </section>
        </div>
      </section>
    </div>
  )
}
