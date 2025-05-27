import { useEffect, useState } from 'react'

import {
  TalentEditInfoData,
  TalentsInputData,
} from '../../../../app/constants/constants'
import {
  Fields,
  PartialFieldsPostData,
} from '../../../../features/Admin/TalentsPage/EditTalentPage/Fields/Fields'
import { ButtonBlue } from '../../../../shared/ui/ButtonBlue/ButtonBlue'
import { useCustomToast } from '../../../../shared/ui/CustomToast/CustomToast'
import { LoadingSpinner } from '../../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { getTalentInfo } from '../../../../shared/utils/api/Admin/Talents/EditTalent/GetTalentInfo'
import { putUpdateTalentInfo } from '../../../../shared/utils/api/Admin/Talents/EditTalent/PutUpdateTalentInfo'
import { updateAdditionallyTalentInfo } from '../../../../shared/utils/api/Admin/Talents/EditTalent/UpdateAdditionallyTalentInfo'
import { updateTalentAvatar } from '../../../../shared/utils/api/Admin/Talents/EditTalent/UpdateTalentAvatar'
import { getTalentsInputData } from '../../../../shared/utils/api/Admin/Talents/GetTalentsInputData'
import { useIdFromUrl } from '../../../../shared/utils/usefulMethods'
import { RecentCard } from '../../../../widgets/RecentCard/RecentCard'
import styles from './EditTalentPage.module.scss'

export const AdminEditTalentPage = () => {
  const [formData, setFormData] = useState<PartialFieldsPostData>({})

  const [data, setData] = useState<TalentEditInfoData | null>(null)
  const [inputData, setInputData] = useState<TalentsInputData | null>(null)

  const id = useIdFromUrl('talent')
  const showToast = useCustomToast()

  const getInfoTalent = async () => {
    if (id === null) return

    const getInfo = await getTalentInfo(id)

    setData(getInfo)
  }

  const getInputData = async () => {
    const getResponse = await getTalentsInputData()

    const { allSkills, industries, keySkills, ...otherData } = getResponse

    const updatedResponse = {
      allSkills: allSkills.map((skill: any) => ({
        value: skill.value.replace(/&amp;/g, '&'),
      })),
      industries: industries.map((industry: any) => ({
        value: industry.value.replace(/&amp;/g, '&'),
      })),
      keySkills: keySkills.map((keySkill: any) => ({
        value: keySkill.value.replace(/&amp;/g, '&'),
      })),
      ...otherData,
    }

    setInputData(updatedResponse)
  }

  const updateTalentInfo = async () => {
    if (id === null) return

    const updateResponse = await putUpdateTalentInfo(id, formData)

    if (updateResponse.status) {
      showToast({
        title: 'Successfully',
        description:
          'You have successfully updated your Talent information.',
        status: 'success',
      })
    } else {
      showToast({
        title: 'Error',
        description: updateResponse.message,
        status: 'error',
      })
    }
  }

  const updateAvatar = async (file: FormData) => {
    if (id === null) return

    const updateResponse = await updateTalentAvatar(id, file)

    if (updateResponse.status) {
      showToast({
        title: 'Successfully',
        description: "You have successfully changed Talent's avatar",
        status: 'success',
      })
      getInfoTalent()
    } else {
      showToast({
        title: 'Error',
        description: updateResponse.message,
        status: 'error',
      })
    }
  }

  const updateAdditionallyInfoTalent = async (data: {
    [key: string]: number
  }) => {
    if (id === null) return

    const updateResponse = await updateAdditionallyTalentInfo(id, data)

    if (updateResponse.status) {
      showToast({
        title: 'Successfully',
        description: 'You have successfully updated User information',
        status: 'success',
      })
      getInfoTalent()
    } else {
      showToast({
        title: 'Error',
        description: updateResponse.message,
        status: 'error',
      })
    }
  }

  useEffect(() => {
    document.title = 'infiniti | Edit Talent'
    getInputData()
    getInfoTalent()
  }, [])

  return (
    <div className={styles.wrapper}>
      <section className={styles.section}>
        {data && inputData ? (
          <RecentCard
            title='Edit Talent'
            Component={ButtonBlue}
            style={styles.recentFullScreen}
            componentProps={{
              titleNone: true,
              title: 'Save',
              icon: '/icons/fileWhite.svg',
              iconProps: styles.buttonSaveIcon,
              onClick: updateTalentInfo,
              style: styles.buttonSave,
            }}
          >
            <Fields
              data={data}
              inputData={inputData}
              updateAvatar={updateAvatar}
              updateAdditionallyInfoTalent={updateAdditionallyInfoTalent}
              onFormDataChange={setFormData}
            />
          </RecentCard>
        ) : (
          <LoadingSpinner size='xl' />
        )}
      </section>
    </div>
  )
}
