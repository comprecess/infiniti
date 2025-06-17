import { Textarea } from '@chakra-ui/react'
import { ChangeEvent, Dispatch, SetStateAction } from 'react'

import {
  ProjectsInputData,
  ProjectsNewProjectForm,
} from '../../../../../app/constants/constants'
import { CustomDataPicker } from '../../../../../shared/ui/CustomDataPicker/CustomDataPicker'
import { CustomInput } from '../../../../../shared/ui/CustomInput/CustomInput'
import { CustomSelect } from '../../../../../shared/ui/CustomSelect/CustomSelect'
import { TagSelector } from '../../../../../shared/ui/TagSelector/TagSelector'
import { TextEditor } from '../../../../../shared/ui/TextEditor/TextEditor'
import styles from './Fields.module.scss'

interface FieldsProps {
  inputData: ProjectsInputData
  form: Partial<ProjectsNewProjectForm>
  setForm: Dispatch<SetStateAction<Partial<ProjectsNewProjectForm> | null>>
}

export const Fields = ({ inputData, form, setForm }: FieldsProps) => {
  const handleChangeInput = (
    field: string,
    value: string | number | number[] | string[] | undefined | null,
  ) => {
    if (field === 'type' && typeof value === 'number') {
      value = inputData.type[value]
    } else if (field === 'status' && typeof value === 'number') {
      value = inputData.status[value]
    } else if (
      field === 'client' &&
      typeof value === 'number' &&
      value === 0
    ) {
      value = null
    } else if (
      field === 'owner' &&
      typeof value === 'number' &&
      value === 0
    ) {
      value = null
    } else if (
      field === 'staff' &&
      typeof value === 'number' &&
      value === 0
    ) {
      value = null
    } else if (field === 'members') {
      value = (value as string[])
        .map(account => {
          const staffMember = inputData.staff.find(
            staff => staff.account === account,
          )

          return staffMember ? staffMember.id : null
        })
        .filter(id => id !== null) as number[]
    }

    setForm(prevFormData => ({
      ...prevFormData,
      [field]: value,
    }))
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <section className={styles.section}>
          <CustomInput
            title='Name'
            type='text'
            id='name'
            name='name'
            value={form.name}
            onChange={handleChangeInput}
          />
          <div className={styles.containerItems}>
            <span className={styles.containerItemsTitle}>Summary</span>
            <Textarea
              minHeight='140px'
              maxHeight='232px'
              focusBorderColor='#1b1e29'
              borderColor='#1b1e29'
              color='gray.400'
              backgroundColor='brand.800'
              border='1px solid #1b1e29'
              _hover={{ borderColor: '#1b1e29' }}
              fontSize='16px'
              fontWeight='400'
              lineHeight='24px'
              value={form.summary}
              onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
                handleChangeInput('summary', event.target.value)
              }
            />
          </div>
          <CustomSelect
            title='Type'
            titleOnChange='type'
            value={inputData.type.findIndex(item => item === form.type)}
            idList={inputData.type.map((_item, index) => index)}
            nameList={inputData.type.map(item => item)}
            onChange={handleChangeInput}
          />
          <CustomInput
            title='Budget'
            type='text'
            id='budget'
            name='budget'
            value={form.budget}
            onChange={handleChangeInput}
          />
          <TagSelector
            title='Team Members'
            list={inputData.staff.map(item => item.account)}
            selectedTags={inputData.staff
              .filter(item => form.members?.includes(item.id))
              .map(item => item.account)}
            onTagsChange={tags => handleChangeInput('members', tags)}
          />
        </section>
        <section className={styles.section}>
          <CustomSelect
            title='Customer'
            titleOnChange='client'
            placeholder='Not Selected'
            value={form.client}
            idList={inputData.client.map(item => item.id)}
            nameList={inputData.client.map(item => item.account)}
            onChange={handleChangeInput}
          />
          <CustomSelect
            title='Owner'
            titleOnChange='owner'
            placeholder='Not Selected'
            value={form.owner}
            idList={inputData.staff.map(item => item.id)}
            nameList={inputData.staff.map(item => item.account)}
            onChange={handleChangeInput}
          />
          <CustomSelect
            title='Currency'
            titleOnChange='currency'
            value={form.currency}
            idList={inputData.currency.map(item => item.id)}
            nameList={inputData.currency.map(item => item.code)}
            onChange={handleChangeInput}
          />
          <CustomSelect
            title='Status'
            titleOnChange='status'
            idList={inputData.status.map((_item, index) => index)}
            nameList={inputData.status.map(item => item)}
            value={inputData.status.findIndex(
              item => item === form.status,
            )}
            onChange={handleChangeInput}
          />
          <CustomSelect
            title='Project Manager'
            titleOnChange='staff'
            placeholder='Not Selected'
            value={form.staff}
            idList={inputData.staff.map(item => item.id)}
            nameList={inputData.staff.map(item => item.account)}
            onChange={handleChangeInput}
          />
          <CustomDataPicker
            title='Start Date'
            titleOnChange='startDate'
            value={form.startDate}
            onChange={handleChangeInput}
          />
          <CustomDataPicker
            title='Due Date'
            titleOnChange='dueDate'
            value={form.dueDate}
            onChange={handleChangeInput}
          />
        </section>
      </div>
      <section className={styles.footerTextEditor}>
        <div className={styles.containerItems}>
          <span className={styles.containerItemsTitle}>Details</span>
          <TextEditor
            defaultValue={form.description}
            setValue={message => handleChangeInput('description', message)}
          />
        </div>
      </section>
    </div>
  )
}
