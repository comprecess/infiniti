import { Fragment, useState } from 'react'

import { LeadItem } from '../../../../pages/Admin/LeadsPage/LeadsPage/LeadsPage'
import { ConfirmationModal } from '../../../../shared/ui/ConfirmationModal/ConfirmationModal'
import { CustomDivider } from '../../../../shared/ui/CustomDivider/CustomDivider'
import { CustomMiniButton } from '../../../../shared/ui/CustomMiniButton/CustomMiniButton'
import { ResponsiveRow } from '../../../../shared/ui/ExpandableRow/ResponsiveRow'
import { Title } from '../../../Main/RecentCard/Title/Title'
import { LeadStatusBadge } from './LeadStatusBadge/LeadStatusBadge'
import styles from './RecentLeads.module.scss'

interface RecentLeadsProps {
  leadsList: LeadItem[]
  onSort: (index: number, name: string, type: number) => void
  onEdit: (lead: LeadItem) => void
  onDelete: (id: string) => void
}

export const RecentLeads = ({ leadsList, onSort, onEdit, onDelete }: RecentLeadsProps) => {
  const [sortNumbers, setSortNumbers] = useState<number[]>([1, 1, 1, 1, 1, 1])
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const handleSortChange = (index: number, sortNameItem: string, sortTypeItem: number) => {
    setSortNumbers(prev => prev.map((_n, i) => (i === index ? sortTypeItem : 1)))
    onSort(index, sortNameItem, sortTypeItem)
  }

  const clearSort = () => setSortNumbers(new Array(6).fill(1))

  if (leadsList.length === 0) {
    return (
      <div className={styles.nothingFound}>
        <span className={styles.nothingFoundText}>Nothing Found</span>
      </div>
    )
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.columns}>
        <Title sorted title='Name' style={styles.nameColumn}
          sortType={sortNumbers[0]} sortName='first_name' sortIndex={0}
          changeSortName={handleSortChange} clearSort={clearSort} />
        <Title sorted title='Company' style={`${styles.companyColumn} ${styles.desktopOnly}`}
          sortType={sortNumbers[1]} sortName='company' sortIndex={1}
          changeSortName={handleSortChange} clearSort={clearSort} />
        <Title sorted title='Email' style={`${styles.emailColumn} ${styles.desktopOnly}`}
          sortType={sortNumbers[2]} sortName='email' sortIndex={2}
          changeSortName={handleSortChange} clearSort={clearSort} />
        <Title sorted title='Phone' style={`${styles.phoneColumn} ${styles.desktopOnly}`}
          sortType={sortNumbers[3]} sortName='phone' sortIndex={3}
          changeSortName={handleSortChange} clearSort={clearSort} />
        <Title sorted title='Status' style={`${styles.statusColumn} ${styles.desktopOnly}`}
          sortType={sortNumbers[4]} sortName='status' sortIndex={4}
          changeSortName={handleSortChange} clearSort={clearSort} />
        <Title sorted title='Created' style={`${styles.dateColumn} ${styles.desktopOnly}`}
          sortType={sortNumbers[5]} sortName='created_at' sortIndex={5}
          changeSortName={handleSortChange} clearSort={clearSort} />
        <div className={`${styles.manageColumn} ${styles.desktopOnly}`}>
          <span className={styles.manageTitle}>Manage</span>
        </div>
      </div>

      <div className={styles.items}>
        {leadsList.map((lead, index) => (
          <Fragment key={lead.id}>
            <ResponsiveRow
              visibleFields={[
                {
                  label: 'Name',
                  value: (
                    <span className={styles.nameText}>
                      {lead.name || `${lead.first_name} ${lead.last_name}`.trim()}
                    </span>
                  ),
                  className: styles.nameColumn,
                },
                {
                  label: 'Company',
                  value: <span className={styles.cellText}>{lead.company || '—'}</span>,
                  className: `${styles.companyColumn} ${styles.desktopOnly}`,
                },
                {
                  label: 'Email',
                  value: <span className={styles.cellText}>{lead.email || '—'}</span>,
                  className: `${styles.emailColumn} ${styles.desktopOnly}`,
                },
                {
                  label: 'Phone',
                  value: <span className={styles.cellText}>{lead.phone || '—'}</span>,
                  className: `${styles.phoneColumn} ${styles.desktopOnly}`,
                },
                {
                  label: 'Status',
                  value: <LeadStatusBadge status={lead.status || 'New'} />,
                  className: `${styles.statusColumn} ${styles.desktopOnly}`,
                },
                {
                  label: 'Created',
                  value: <span className={styles.cellText}>{lead.created_at || '—'}</span>,
                  className: `${styles.dateColumn} ${styles.desktopOnly}`,
                },
              ]}
              actions={
                <div className={styles.manageItem}>
                  <CustomMiniButton style='amber' icon='/icons/edit.svg' alt='Edit'
                    tooltipTitle='Edit' onClick={() => onEdit(lead)} />
                  <CustomMiniButton style='cherry' icon='/icons/trash.svg' alt='Delete'
                    tooltipTitle='Delete' onClick={() => setDeleteId(String(lead.id))} />
                </div>
              }
              hiddenFields={[
                {
                  label: 'Company:',
                  value: <span className={styles.cellText}>{lead.company || '—'}</span>,
                },
                {
                  label: 'Status:',
                  value: <LeadStatusBadge status={lead.status || 'New'} />,
                },
                {
                  label: 'Email:',
                  value: <span className={styles.cellText}>{lead.email || '—'}</span>,
                },
                {
                  label: 'Phone:',
                  value: <span className={styles.cellText}>{lead.phone || '—'}</span>,
                },
                {
                  label: 'Created:',
                  value: <span className={styles.cellText}>{lead.created_at || '—'}</span>,
                },
                {
                  label: 'Source:',
                  value: <span className={styles.cellText}>{lead.source || '—'}</span>,
                },
              ]}
            />
            {index !== leadsList.length - 1 && <CustomDivider />}
          </Fragment>
        ))}
      </div>

      {deleteId !== null && (
        <ConfirmationModal
          isOpened={deleteId !== null}
          handleOpenCloseModal={() => setDeleteId(null)}
          agree={() => {
            onDelete(deleteId!)
            setDeleteId(null)
          }}
        />
      )}
    </div>
  )
}
