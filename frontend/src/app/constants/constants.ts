export const roles = {
  client: 'Client',
  admin: 'Resident',
}

export interface ProfileInfo {
  id: number
  account: string
  address: string
  balance: string
  business_number: string
  city: string
  company: string
  country: string
  email: string
  img: string
  lastlogin: string
  notes: string
  phone: string
  state: string
  tags: string
  user_type: string
  zip: string
}
