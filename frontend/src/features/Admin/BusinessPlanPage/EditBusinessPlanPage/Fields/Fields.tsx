import { ChangeEvent, Dispatch, SetStateAction, useRef } from 'react'

import {
  BusinessPlanNewPlanFormData,
  TalentInputDataBusinessPlan,
} from '../../../../../app/constants/constants'
import { ChatGPTIcon } from '../../../../../shared/icons/ChatGPTIcon'
import { ButtonBlue } from '../../../../../shared/ui/ButtonBlue/ButtonBlue'
import { CustomDataPicker } from '../../../../../shared/ui/CustomDataPicker/CustomDataPicker'
import { CustomInput } from '../../../../../shared/ui/CustomInput/CustomInput'
import { useCustomToast } from '../../../../../shared/ui/CustomToast/CustomToast'
import { Icon } from '../../../../../shared/ui/Icon/Icon'
import { TextEditor } from '../../../../../shared/ui/TextEditor/TextEditor'
import styles from './Fields.module.scss'
import { ChatGPTCard } from './Team/ChatGPTCard/ChatGPTCard'
import { PeopleCard } from './Team/PeopleCard/PeopleCard'
import { PlusCard } from './Team/PlusCard/PlusCard'

interface FieldsProps {
  isLoadingTeam: boolean
  formData: Partial<BusinessPlanNewPlanFormData>
  inputData: TalentInputDataBusinessPlan[]
  setFormData: Dispatch<
  SetStateAction<Partial<BusinessPlanNewPlanFormData> | null>
  >
  setModalAddTalent: Dispatch<SetStateAction<boolean>>
  addNewTalentChatGPT: () => void
  deleteTalent: (id: number) => void
}

export const Fields = ({
  isLoadingTeam,
  formData,
  inputData,
  setFormData,
  setModalAddTalent,
  addNewTalentChatGPT,
  deleteTalent,
}: FieldsProps) => {
  const inputRef = useRef<HTMLInputElement>(null)

  const showToast = useCustomToast()

  const handleButtonUploadContent = () => {
    inputRef.current?.click()
  }

  const handlePictureChange = async (
    event: ChangeEvent<HTMLInputElement>,
    key: string,
  ) => {
    const files = event.target.files

    if (files && files.length > 0) {
      if (
        !['image/jpeg', 'image/jpg', 'image/png', 'image/bmp'].includes(
          files[0].type,
        )
      ) {
        showToast({
          title: 'Error',
          description: 'Only JPEG and PNG images are allowed',
          status: 'error',
        })

        return
      }

      setFormData(prevFormData => ({
        ...prevFormData,
        [key]: files[0],
      }))
    }
  }

  const handleChangeInput = (
    field: string,
    value: string | number | undefined | null,
  ) => {
    setFormData(prevFormData => {
      if (!prevFormData) return prevFormData
      if (!(field in prevFormData)) return prevFormData
      if (field === 'teams') return prevFormData

      const updatedFormData: Partial<BusinessPlanNewPlanFormData> = {
        ...prevFormData,
      }

      if (value === '' || value === null || value === undefined) {
        delete updatedFormData[field as keyof BusinessPlanNewPlanFormData]
      } else {
        //@ts-ignore
        updatedFormData[field as keyof BusinessPlanNewPlanFormData] =
          value as string
      }

      return updatedFormData
    })
  }

  const handlePictureDelete = () => {
    handleChangeInput('fileDelete', 1)

    setFormData(prevFormData => ({
      ...prevFormData,
      file: undefined,
    }))
  }

  return (
    <div className={styles.wrapper}>
      <CustomInput
        title='Business/Company Name'
        type='text'
        id='companyName'
        name='companyName'
        value={formData.companyName}
        onChange={handleChangeInput}
      />
      <div className={styles.containerInputs}>
        <div className={styles.inputsColumn}>
          <CustomInput
            title='Your Name'
            type='text'
            id='name'
            name='name'
            value={formData.name}
            onChange={handleChangeInput}
          />
          <CustomInput
            title='Email'
            type='text'
            id='email'
            name='email'
            value={formData.email}
            onChange={handleChangeInput}
          />
        </div>
        <div className={styles.inputsColumn}>
          <CustomInput
            title='Phone'
            type='text'
            id='phone'
            name='phone'
            value={formData.phone}
            onChange={handleChangeInput}
          />
          <CustomDataPicker
            title='Date'
            titleOnChange='date'
            value={formData.date}
            onChange={handleChangeInput}
          />
        </div>
      </div>
      <CustomInput
        title='Website'
        type='text'
        id='website'
        name='website'
        value={formData.website}
        onChange={handleChangeInput}
      />
      <div className={styles.containerItems}>
        <span className={styles.containerItemsTitle}>Picture</span>
        <div className={styles.pictureContainer}>
          <img
            alt='Avatar'
            className={styles.preview}
            src={
              formData.file
                ? typeof formData.file === 'string'
                  ? formData.file
                  : URL.createObjectURL(formData.file)
                : '/test_3.jpeg'
            }
          />
          <div className={styles.buttonsContainer}>
            <div className={styles.uploadPicture}>
              <ButtonBlue
                title='Upload picture'
                style={styles.buttonUpload}
                onClick={handleButtonUploadContent}
              />
              <input
                ref={inputRef}
                type='file'
                style={{ display: 'none' }}
                onChange={event => handlePictureChange(event, 'file')}
              />
            </div>
            {formData.file && (
              <ButtonBlue
                title='Remove picture'
                style={styles.buttonRemove}
                onClick={handlePictureDelete}
              />
            )}
          </div>
        </div>
      </div>
      <div className={styles.containerItems}>
        <div className={styles.containerItemsTitleRow}>
          <span className={styles.containerItemsTitle}>
            Executive Summary
          </span>
          <span className={styles.containerItemsTitleBlue}>
            (a snapshot of your business)
          </span>
        </div>
        <TextEditor
          chatGPT
          fieldName='exSummary'
          defaultValue={formData.exSummary}
          setValue={message => handleChangeInput('exSummary', message)}
        />
      </div>
      <div className={styles.containerItems}>
        <div className={styles.containerItemsTitleRow}>
          <span className={styles.containerItemsTitle}>
            Company description
          </span>
          <span className={styles.containerItemsTitleBlue}>
            (describe what you do)
          </span>
        </div>
        <TextEditor
          chatGPT
          fieldName='description'
          defaultValue={formData.description}
          setValue={message => handleChangeInput('description', message)}
        />
      </div>
      <div className={styles.containerItems}>
        <div className={styles.containerItemsTitleRow}>
          <span className={styles.containerItemsTitle}>
            Market Analysis
          </span>
          <span className={styles.containerItemsTitleBlue}>
            (research on your industry, market and competitors)
          </span>
        </div>
        <TextEditor
          chatGPT
          fieldName='mAnalysis'
          defaultValue={formData.mAnalysis}
          setValue={message => handleChangeInput('mAnalysis', message)}
        />
      </div>
      <div className={styles.containerItems}>
        <div className={styles.containerItemsTitleRow}>
          <span className={styles.containerItemsTitle}>
            Organization & Management
          </span>
          <span className={styles.containerItemsTitleBlue}>
            (your business and management structure)
          </span>
        </div>
        <TextEditor
          chatGPT
          fieldName='management'
          defaultValue={formData.management}
          setValue={message => handleChangeInput('management', message)}
        />
      </div>
      {!isLoadingTeam ? (
        <div className={styles.teamWrapper}>
          {formData.teams &&
            formData.teams.map(id => {
              return (
                <PeopleCard
                  key={id}
                  isRemove
                  talent={inputData.find(item => item.id === id)}
                  deleteTalent={deleteTalent}
                />
              )
            })}
          <PlusCard onClick={() => setModalAddTalent(prev => !prev)} />
          <ChatGPTCard addNewTalentChatGPT={addNewTalentChatGPT} />
        </div>
      ) : (
        <div className={styles.chatGPTLoading}>
          <Icon
            hover={false}
            icon={<ChatGPTIcon style={styles.icon} />}
            style={styles.wrapperIcon}
          />
          <span className={styles.chatGPTLoadingText}>
            ChatGPT is assembling a Team
          </span>
        </div>
      )}
      <div className={styles.containerItems}>
        <div className={styles.containerItemsTitleRow}>
          <span className={styles.containerItemsTitle}>
            Service or product
          </span>
          <span className={styles.containerItemsTitleBlue}>
            (the products or services you’re offering)
          </span>
        </div>
        <TextEditor
          chatGPT
          fieldName='product'
          defaultValue={formData.product}
          setValue={message => handleChangeInput('product', message)}
        />
      </div>
      <div className={styles.containerItems}>
        <div className={styles.containerItemsTitleRow}>
          <span className={styles.containerItemsTitle}>
            Marketing and sales
          </span>
          <span className={styles.containerItemsTitleBlue}>
            (how you’ll market your business and your sales strategy)
          </span>
        </div>
        <TextEditor
          chatGPT
          fieldName='marketing'
          defaultValue={formData.marketing}
          setValue={message => handleChangeInput('marketing', message)}
        />
      </div>
      <div className={styles.containerItems}>
        <div className={styles.containerItemsTitleRow}>
          <span className={styles.containerItemsTitle}>Budget</span>
          <span className={styles.containerItemsTitleBlue}>
            (budget of your company for next 2 years with source of the
            money)
          </span>
        </div>
        <TextEditor
          chatGPT
          fieldName='budget'
          defaultValue={formData.budget}
          setValue={message => handleChangeInput('budget', message)}
        />
      </div>
      <div className={styles.containerItems}>
        <div className={styles.containerItemsTitleRow}>
          <span className={styles.containerItemsTitle}>
            Investment/Funding request
          </span>
          <span className={styles.containerItemsTitleBlue}>
            (how much money you’ll need for next 3 to 5 years)
          </span>
        </div>
        <TextEditor
          chatGPT
          fieldName='investment'
          defaultValue={formData.investment}
          setValue={message => handleChangeInput('investment', message)}
        />
      </div>
      <div className={styles.containerItems}>
        <div className={styles.containerItemsTitleRow}>
          <span className={styles.containerItemsTitle}>
            Financial projections
          </span>
          <span className={styles.containerItemsTitleBlue}>
            (supply information like balance sheets)
          </span>
        </div>
        <TextEditor
          chatGPT
          fieldName='finance'
          defaultValue={formData.finance}
          setValue={message => handleChangeInput('finance', message)}
        />
      </div>
      <div className={styles.containerItems}>
        <div className={styles.containerItemsTitleRow}>
          <span className={styles.containerItemsTitle}>Appendix</span>
          <span className={styles.containerItemsTitleBlue}>
            (an optional section that includes résumés and permits)
          </span>
        </div>
        <TextEditor
          chatGPT
          fieldName='appendix'
          defaultValue={formData.appendix}
          setValue={message => handleChangeInput('appendix', message)}
        />
      </div>
    </div>
  )
}
