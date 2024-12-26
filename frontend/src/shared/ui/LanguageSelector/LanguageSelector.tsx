import { useTranslation } from 'react-i18next'

import { CustomSelect } from '../CustomSelect/CustomSelect'

const languages = [
  { id: 0, name: 'Русский', code: 'ru' },
  { id: 1, name: 'English', code: 'en' },
]

export const LanguageSelector = () => {
  const { i18n, t } = useTranslation()

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang)
    localStorage.setItem('language', lang)
  }

  const currentLanguage =
    i18n.language || localStorage.getItem('language') || 'ru'

  const currentLanguageIndex = languages.findIndex(
    item => item.code === currentLanguage,
  )

  return (
    <CustomSelect
      title={t('admin-settings-localization-page-select-1')}
      idList={languages.map(item => item.id)}
      nameList={languages.map(item => item.name)}
      value={currentLanguageIndex}
      onChange={(_name, value) => changeLanguage(languages[value].code)}
    />
  )
}
