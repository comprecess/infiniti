export const authTokenString = 'authToken'
export const profileInfoString = 'profileInfo'

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

export interface UserPropertiesProps {
  children: []
  filter: number
  id: number
  name: string
  nameId: string
  parentId: number
  type: string
  value: { id: number; propId: number; value: string }[]
}
