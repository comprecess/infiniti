export const authTokenString = 'authToken'
export const profileInfoString = 'profileInfo'
export const userTalentsPageString = 'userTalentsPage'

export const page = '?page='

export const roles = {
  client: 'Client',
  admin: 'Admin',
}

export interface FiltersState {
  [key: string]: (number | null)[]
}

export interface UpdateProfileInfoProps {
  account: string
  email: string
  company?: string
  businessNumber?: string
  phone?: string
  address?: string
  city?: string
  state?: string
  zip?: string
  country?: string
  password?: string
}

export interface UserInfo {
  id: number
  account: string
  address: string
  balance: string
  businessNumber: string
  city: string
  company: string
  country: string
  email: string
  img: string
  lastLogin: string
  notes: string
  phone: string
  state: string
  tags: string
  userType: string
  zip: string
}

export interface AdminInfo {
  id: number
  roleId: number
  addressLine1: string
  addressLine2: string
  amount: string
  city: string
  country: string
  currency: string
  account: string
  img: string
  jobTitle: string
  language: string
  lastActivity: string
  payFrequency: string
  phoneNumber: string
  role: string
  state: string
  summary: string
  userName: string
  userType: string
  zip: string
}

export interface TalentData {
  id: number
  img: string
  blockExperience: BlockExperienceProps[]
  experience: ExperienceProps
  educationDegree: string
  educationGraduation: string
  educationName: string
  educationSpecialization: string
  industries: []
  keySkills: []
  allSkills: []
  language: string
  level: string
  name: string
  similar: TalentsProps[]
  priceDay: string
  priceHour: string
  specialization: string
  timezone: string
}

export interface TalentsProps {
  id: number
  img: string
  industries: []
  keySkills: []
  level: string
  name: string
  priceDay: string
  priceHour: string
  specialization: string
  timezone: string
}

export interface BlockExperienceProps {
  id: number
  name: string
  periodFrom: string
  periodTo: string
  position: string
  responsibilities: string
}

export interface ExperienceProps {
  day: number
  month: number
  year: number
}

export interface FiltersData {
  id: number
  name: string
  nameId: string
  type: string
  options: OptionsProps
  children: ChildrenProps[]
  values: ValuesProps[]
}

export interface ChildrenProps {
  id: number
  children: any[]
  filter: number
  name: string
  nameId: string
  options: OptionsProps
  parentId: number
  type: string
  values: ValuesProps[]
}

export interface OptionsProps {
  placeholder: PlaceHolderProps
}

export interface PlaceHolderProps {
  from: number
  to: number
}

export interface ValuesProps {
  id: number
  propId: number
  value: string
}

export interface TalentsListMetaData {
  current_page: number
  from: number
  last_page: number
  links: LinksProps[]
  path: string
  per_page: number
  to: number
  total: number
}

interface LinksProps {
  active: boolean
  label: string
  url: string
}

export interface CartProps {
  count: number
  items: ItemsCartProps[]
  total: string
  subTax: string
  subTotal: string
}

export type NameIdType = 'priceHour' | 'priceDay'

export interface ItemsCartProps {
  id: number
  amount: number
  nameIdType: NameIdType
  price: string
  taxes: string
  taxesInclude: number
  total: string
  userCatalog: TalentData
}

export interface CurrencyProps {
  id: number
  code: string
  isdefault: number
  rate: string
  symbol: string
}

export interface GroupsListProps {
  id: number
  name: string
  sort: number
}

export interface GroupContactsListProps {
  id: number
  account: string
  img: string
  company: CompanyProps
  group: GroupProps
  email: string
  phone: string
}

interface CompanyProps {
  id: number
  code: string
  name: string
}

interface GroupProps {
  id: number
  name: string
  sort: number
}

export interface CompaniesListProps {
  id: number
  logo: string
  name: string
  code: string
  email: string
  phone: string
}

export interface CompanyData {
  name: string
  code: string
  logo: string
  address: string
  businessNumber: string
  city: string
  url: string
  state: string
  email: string
  zip: string
  phone: string
  country: string
}
