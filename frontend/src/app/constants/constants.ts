export const authTokenString = 'authToken'
export const profileInfoString = 'profileInfo'

export const roles = {
  client: 'Client',
  admin: 'Resident',
}

export interface ProfileInfo {
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
