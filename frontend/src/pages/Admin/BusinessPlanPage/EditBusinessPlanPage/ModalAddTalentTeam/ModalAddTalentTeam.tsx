import styles from './ModalAddTalentTeam.module.scss'
import { TalentInputDataBusinessPlan } from '../../../../../app/constants/constants'
import { PeopleCard } from '../../../../../features/Admin/BusinessPlanPage/EditBusinessPlanPage/Fields/Team/PeopleCard/PeopleCard'
import { CustomModalWindow } from '../../../../../shared/ui/CustomModalWindow/CustomModalWindow'

interface ModalAddTalentTeamProps {
  inputData: TalentInputDataBusinessPlan[]
  teams: number[] | undefined
  isOpen: boolean
  onClose: () => void
  addTalent: (id: number) => void
  deleteTalent: (id: number) => void
}

export const ModalAddTalentTeam = ({
  inputData,
  teams,
  isOpen,
  onClose,
  addTalent,
  deleteTalent,
}: ModalAddTalentTeamProps) => {
  return (
    <CustomModalWindow isOpen={isOpen} maxWidth='741px' onClose={onClose}>
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <h4 className={styles.title}>Select Talent for Team</h4>
          <button className={styles.closeButton} onClick={onClose} aria-label='Close'>
            ✕
          </button>
        </div>
        <div className={styles.talentsList}>
          {inputData.map(talent => {
            return (
              <PeopleCard
                key={talent.id}
                talent={talent}
                isAdd={!teams?.includes(talent.id)}
                isRemove={teams?.includes(talent.id)}
                addTalent={addTalent}
                deleteTalent={deleteTalent}
              />
            )
          })}
        </div>
      </div>
    </CustomModalWindow>
  )
}
