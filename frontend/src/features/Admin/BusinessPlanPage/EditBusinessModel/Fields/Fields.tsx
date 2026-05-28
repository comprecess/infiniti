import { Textarea } from '@chakra-ui/react'
import { ChangeEvent, Dispatch, SetStateAction, useRef } from 'react'
import { useTranslation } from 'react-i18next'

import styles from './Fields.module.scss'
import {
  BusinessModelInputData,
  BusinessPlanBusinessModelFormData,
} from '../../../../../app/constants/constants'
import { ButtonBlue } from '../../../../../shared/ui/ButtonBlue/ButtonBlue'
import { CustomDataPicker } from '../../../../../shared/ui/CustomDataPicker/CustomDataPicker'
import { CustomInput } from '../../../../../shared/ui/CustomInput/CustomInput'
import { CustomSelect } from '../../../../../shared/ui/CustomSelect/CustomSelect'
import { useCustomToast } from '../../../../../shared/ui/CustomToast/CustomToast'
import { TagSelector } from '../../../../../shared/ui/TagSelector/TagSelector'
import { TextEditor } from '../../../../../shared/ui/TextEditor/TextEditor'

interface FieldsProps {
  inputData: BusinessModelInputData
  formData: PartialFieldsPostData
  setFormData: Dispatch<SetStateAction<PartialFieldsPostData>>
  removePicture: (data: { [key: string]: number }) => void
  updatePicture: (file: FormData) => void
}

export interface PartialFieldsPostData
  extends Partial<BusinessPlanBusinessModelFormData> {
  [key: string]: string | number | string[] | undefined | null
}

// ─── Section divider ─────────────────────────────────────────────────────────
const Section = ({ title, subtitle }: { title: string; subtitle?: string }) => (
  <div className={styles.sectionDivider}>
    <span className={styles.sectionDividerTitle}>{title}</span>
    {subtitle && <span className={styles.sectionDividerSub}>{subtitle}</span>}
  </div>
)

export const Fields = ({
  inputData,
  formData,
  setFormData,
  removePicture,
  updatePicture,
}: FieldsProps) => {
  const { t } = useTranslation()

  const showToast = useCustomToast()
  const inputRefFirst = useRef<HTMLInputElement>(null)
  const inputRefSecond = useRef<HTMLInputElement>(null)

  const handleButtonUploadPreview = () => {
    inputRefFirst.current?.click()
  }

  const handleButtonUploadContent = () => {
    inputRefSecond.current?.click()
  }

  const handleAvatarChange = async (
    event: ChangeEvent<HTMLInputElement>,
    key: 'preview' | 'content',
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

      const file = new FormData()

      file.append(key, files[0])

      updatePicture(file)
    }
  }

  const handleChangeInput = (
    field: string,
    value: string | number | string[] | undefined | null,
  ) => {
    setFormData(prevFormData => {
      const updatedFormData = { ...prevFormData }

      if (value === '' || value === null || value === undefined) {
        delete updatedFormData[field]
      } else {
        updatedFormData[field] = value
      }

      return updatedFormData
    })
  }

  return (
    <div className={styles.wrapper}>

      {/* ── 1. Basic Info ─────────────────────────────────────────────────── */}
      <Section title="1. Basic Info" subtitle="Title, descriptions, images, price, age" />

      <CustomInput
        title={`${t('admin-edit-business-model-page-input-1')}`}
        type='text'
        id='title'
        name='title'
        value={formData.title}
        onChange={handleChangeInput}
      />
      <div className={styles.containerItems}>
        <span className={styles.containerItemsTitle}>
          {`${t('admin-edit-business-model-page-input-2')}`}
        </span>
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
          defaultValue={formData.description}
          onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
            handleChangeInput('description', event.target.value)
          }
        />
      </div>
      <div className={styles.containerItems}>
        <span className={styles.containerItemsTitle}>
          {`${t('admin-edit-business-model-page-input-3')}`}
        </span>
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
          defaultValue={formData.fullDescription}
          onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
            handleChangeInput('fullDescription', event.target.value)
          }
        />
      </div>
      <div className={styles.containerItems}>
        <span className={styles.containerItemsTitle}>
          {t('admin-make-business-model-page-input-12')}
        </span>
        <div className={styles.avatarContainer}>
          {formData.preview && (
            <img
              src={formData.preview}
              alt='Avatar'
              className={styles.avatar}
            />
          )}
          <div className={styles.buttonsContainer}>
            <div className={styles.uploadPicture}>
              <ButtonBlue
                title='Upload picture'
                style={styles.buttonUpload}
                onClick={handleButtonUploadPreview}
              />
              <input
                ref={inputRefFirst}
                type='file'
                style={{ display: 'none' }}
                onChange={event => handleAvatarChange(event, 'preview')}
              />
            </div>
            {formData.preview && (
              <ButtonBlue
                title='Remove picture'
                style={styles.buttonRemove}
                onClick={() => removePicture({ previewDelete: 1 })}
              />
            )}
          </div>
          <span className={styles.infoPicture}>
            Please upload the image in rectangular format with a resolution
            of 570x350 pixels or with an aspect ratio of 3:2
          </span>
        </div>
      </div>
      <div className={styles.containerItems}>
        <span className={styles.containerItemsTitle}>
          {t('admin-make-business-model-page-input-13')}
        </span>
        <div className={styles.avatarContainer}>
          {formData.content && (
            <img
              src={formData.content}
              alt='Avatar'
              className={styles.avatar}
            />
          )}
          <div className={styles.buttonsContainer}>
            <div className={styles.uploadPicture}>
              <ButtonBlue
                title='Upload picture'
                style={styles.buttonUpload}
                onClick={handleButtonUploadContent}
              />
              <input
                ref={inputRefSecond}
                type='file'
                style={{ display: 'none' }}
                onChange={event => handleAvatarChange(event, 'content')}
              />
            </div>
            {formData.content && (
              <ButtonBlue
                title='Remove picture'
                style={styles.buttonRemove}
                onClick={() => removePicture({ contentDelete: 1 })}
              />
            )}
          </div>
          <span className={styles.infoPicture}>
            Please upload the image in rectangular format with a resolution
            of 730x480 pixels or with an aspect ratio of 3:2
          </span>
        </div>
      </div>
      <CustomInput
        title={`${t('admin-edit-business-model-page-input-7')}`}
        type='text'
        id='price'
        name='price'
        value={formData.price}
        onChange={handleChangeInput}
      />
      <CustomInput
        title={`${t('admin-edit-business-model-page-input-9')}`}
        type='number'
        id='age'
        name='age'
        value={formData.age}
        onChange={handleChangeInput}
      />
      <CustomDataPicker
        title={`${t('admin-edit-business-model-page-input-4')}`}
        titleOnChange='start'
        value={formData.start}
        onChange={handleChangeInput}
      />

      {/* ── 2. Taxonomy / Tags ────────────────────────────────────────────── */}
      <Section title="2. Taxonomy" subtitle="Industries, technologies, location, category, profitability" />

      <TagSelector
        title={`${t('admin-edit-business-model-page-input-5')}`}
        list={inputData.industries.map(spec => spec.value)}
        selectedTags={formData.industries || []}
        onTagsChange={tags => handleChangeInput('industries', tags)}
      />
      <TagSelector
        title={`${t('admin-edit-business-model-page-input-6')}`}
        list={inputData.technologies.map(spec => spec.value)}
        selectedTags={formData.technologies || []}
        onTagsChange={tags => handleChangeInput('technologies', tags)}
      />
      <TagSelector
        title={`${t('admin-edit-business-model-page-input-8')}`}
        list={inputData.location.map(spec => spec.value)}
        selectedTags={formData.location || []}
        onTagsChange={tags => handleChangeInput('location', tags)}
      />
      <TagSelector
        title={`${t('admin-edit-business-model-page-input-10')}`}
        list={inputData.category.map(spec => spec.value)}
        selectedTags={formData.category || []}
        onTagsChange={tags => handleChangeInput('category', tags)}
      />
      <CustomSelect
        title={`${t('admin-edit-business-model-page-input-11')}`}
        titleOnChange='profitability'
        idList={inputData.profitability.map(item => item.id)}
        nameList={inputData.profitability.map(item => item.value)}
        value={formData.profitability}
        onChange={handleChangeInput}
      />

      {/* ── 3. Overview KPI ───────────────────────────────────────────────── */}
      <Section
        title="3. Overview KPI"
        subtitle="6 metrics shown on the Overview tab. Value = short string (e.g. '82%', '$4.2B', '6–7 mo'). Sub = caption below."
      />
      <div className={styles.kpiGrid}>
        <div className={styles.kpiPair}>
          <CustomInput title="Gross Margin — value" type="text" id="kpiGrossMargin" name="kpiGrossMargin" value={formData.kpiGrossMargin} onChange={handleChangeInput} />
          <CustomInput title="Gross Margin — sub" type="text" id="kpiGrossMarginSub" name="kpiGrossMarginSub" value={formData.kpiGrossMarginSub} onChange={handleChangeInput} />
        </div>
        <div className={styles.kpiPair}>
          <CustomInput title="Payback — value" type="text" id="kpiPayback" name="kpiPayback" value={formData.kpiPayback} onChange={handleChangeInput} />
          <CustomInput title="Payback — sub" type="text" id="kpiPaybackSub" name="kpiPaybackSub" value={formData.kpiPaybackSub} onChange={handleChangeInput} />
        </div>
        <div className={styles.kpiPair}>
          <CustomInput title="LTV / CAC — value" type="text" id="kpiLtvCac" name="kpiLtvCac" value={formData.kpiLtvCac} onChange={handleChangeInput} />
          <CustomInput title="LTV / CAC — sub" type="text" id="kpiLtvCacSub" name="kpiLtvCacSub" value={formData.kpiLtvCacSub} onChange={handleChangeInput} />
        </div>
        <div className={styles.kpiPair}>
          <CustomInput title="NRR — value" type="text" id="kpiNrr" name="kpiNrr" value={formData.kpiNrr} onChange={handleChangeInput} />
          <CustomInput title="NRR — sub" type="text" id="kpiNrrSub" name="kpiNrrSub" value={formData.kpiNrrSub} onChange={handleChangeInput} />
        </div>
        <div className={styles.kpiPair}>
          <CustomInput title="Market — value" type="text" id="kpiMarket" name="kpiMarket" value={formData.kpiMarket} onChange={handleChangeInput} />
          <CustomInput title="Market — sub" type="text" id="kpiMarketSub" name="kpiMarketSub" value={formData.kpiMarketSub} onChange={handleChangeInput} />
        </div>
        <div className={styles.kpiHint}>
          <span>6th KPI = Plan Price (taken from the Price field above — no separate input needed)</span>
        </div>
      </div>

      {/* ── 4. Unit Economics KPI ─────────────────────────────────────────── */}
      <Section
        title="4. Unit Economics KPI"
        subtitle="6 metrics shown on the Economics tab. Gross Margin / Payback / LTV·CAC / NRR reuse Overview values."
      />
      <div className={styles.kpiGrid}>
        <div className={styles.kpiPair}>
          <CustomInput title="ARPA — value (e.g. '$1.8k')" type="text" id="kpiArpa" name="kpiArpa" value={formData.kpiArpa} onChange={handleChangeInput} />
          <CustomInput title="ARPA — sub (e.g. 'monthly / client')" type="text" id="kpiArpaSub" name="kpiArpaSub" value={formData.kpiArpaSub} onChange={handleChangeInput} />
        </div>
        <div className={styles.kpiPair}>
          <CustomInput title="CAC — value (e.g. '$6k')" type="text" id="kpiCac" name="kpiCac" value={formData.kpiCac} onChange={handleChangeInput} />
          <CustomInput title="CAC — sub (e.g. 'acquisition cost')" type="text" id="kpiCacSub" name="kpiCacSub" value={formData.kpiCacSub} onChange={handleChangeInput} />
        </div>
        <div className={styles.kpiHint}>
          <span>Remaining 4 KPIs (GM, Payback, LTV/CAC, NRR) are shared with Overview — edit above.</span>
        </div>
      </div>

      {/* ── 5. Passport ───────────────────────────────────────────────────── */}
      <Section title="5. Passport" subtitle="Deep sections: who is the client, value prop, moat" />

      <div className={styles.containerItems}>
        <span className={styles.containerItemsTitle}>Target Client &amp; JTBD</span>
        <TextEditor
          chatGPT
          fieldName='targetClient'
          defaultValue={formData.targetClient as string | undefined}
          setValue={message => handleChangeInput('targetClient', message)}
        />
      </div>
      <div className={styles.containerItems}>
        <span className={styles.containerItemsTitle}>Value Proposition &amp; Moat</span>
        <TextEditor
          chatGPT
          fieldName='valueProposition'
          defaultValue={formData.valueProposition as string | undefined}
          setValue={message => handleChangeInput('valueProposition', message)}
        />
      </div>

      {/* ── 6. Revenue ────────────────────────────────────────────────────── */}
      <Section title="6. Revenue" subtitle="Revenue logic, financial model, market analysis" />

      <div className={styles.containerItems}>
        <span className={styles.containerItemsTitle}>Revenue Logic</span>
        <TextEditor
          chatGPT
          fieldName='revenueLogic'
          defaultValue={formData.revenueLogic as string | undefined}
          setValue={message => handleChangeInput('revenueLogic', message)}
        />
      </div>
      <div className={styles.containerItems}>
        <span className={styles.containerItemsTitle}>
          {`${t('admin-make-business-model-page-input-14')}`}
        </span>
        <TextEditor
          chatGPT
          fieldName='marketAnalysis'
          defaultValue={formData.marketAnalysis}
          setValue={message =>
            handleChangeInput('marketAnalysis', message)
          }
        />
      </div>
      <div className={styles.containerItems}>
        <span className={styles.containerItemsTitle}>
          {`${t('admin-make-business-model-page-input-15')}`}
        </span>
        <TextEditor
          chatGPT
          fieldName='financialModel'
          defaultValue={formData.financialModel}
          setValue={message =>
            handleChangeInput('financialModel', message)
          }
        />
      </div>

      {/* ── 7. Unit Economics ─────────────────────────────────────────────── */}
      <Section title="7. Unit Economics" subtitle="Rich text explanation (shown below the KPI grid)" />

      <div className={styles.containerItems}>
        <span className={styles.containerItemsTitle}>Unit Economics</span>
        <TextEditor
          chatGPT
          fieldName='unitEconomics'
          defaultValue={formData.unitEconomics as string | undefined}
          setValue={message => handleChangeInput('unitEconomics', message)}
        />
      </div>

      {/* ── 8. Traction & Scale ───────────────────────────────────────────── */}
      <Section title="8. Traction &amp; Scale" subtitle="Stages of implementation, current investors" />

      <div className={styles.containerItems}>
        <span className={styles.containerItemsTitle}>
          {`${t('admin-make-business-model-page-input-17')}`}
        </span>
        <TextEditor
          chatGPT
          fieldName='stagesOfImplementation'
          defaultValue={formData.stagesOfImplementation}
          setValue={message =>
            handleChangeInput('stagesOfImplementation', message)
          }
        />
      </div>
      <div className={styles.containerItems}>
        <span className={styles.containerItemsTitle}>
          {`${t('admin-make-business-model-page-input-16')}`}
        </span>
        <TextEditor
          chatGPT
          fieldName='currentInvestors'
          defaultValue={formData.currentInvestors}
          setValue={message =>
            handleChangeInput('currentInvestors', message)
          }
        />
      </div>

      {/* ── 9. Partnership & Risks ────────────────────────────────────────── */}
      <Section title="9. Partnership &amp; Risks" subtitle="Partnership options, facts, hypotheses, risks" />

      <div className={styles.containerItems}>
        <span className={styles.containerItemsTitle}>
          {`${t('admin-make-business-model-page-input-18')}`}
        </span>
        <TextEditor
          chatGPT
          fieldName='partnershipOptions'
          defaultValue={formData.partnershipOptions}
          setValue={message =>
            handleChangeInput('partnershipOptions', message)
          }
        />
      </div>
      <div className={styles.containerItems}>
        <span className={styles.containerItemsTitle}>Facts, Hypotheses &amp; Risks</span>
        <TextEditor
          chatGPT
          fieldName='factsHypothesesRisks'
          defaultValue={formData.factsHypothesesRisks as string | undefined}
          setValue={message => handleChangeInput('factsHypothesesRisks', message)}
        />
      </div>

    </div>
  )
}
