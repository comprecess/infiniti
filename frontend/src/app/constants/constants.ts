export const authTokenString = 'authToken'
export const profileInfoString = 'profileInfo'
export const userTalentsPageString = 'userTalentsPage'

export const roles = {
  client: 'Client',
  admin: 'Admin',
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
  fullName: string
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
  industries: []
  keySkills: []
  level: string
  name: string
  priceDay: string
  priceHour: string
  specialization: string
  timezone: string
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
  children: any[]
  filter: number
  id: number
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
