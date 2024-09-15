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

export interface ViewPageContext {
  idClient: number
  idType: number
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

export interface PagesMetaData {
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
  info: { symbol: string }
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
  notes: string
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

export interface ViewCompanyProps {
  logo: string
  name: string
  type: TypeViewCompany
}

export interface TypeViewCompany {
  [key: string]: number | null
}

export interface CustomersViewCompany {
  id: number
  account: string
  email: string
  phone: string
}

export interface InvoicesViewCompany {
  id: number
  account: string
  client: { id: number }
  code: string
  total: string
  date: string
  dueDate: string
  status: string
}

export interface OffersViewCompany {
  id: number
  account: string
  client: { id: number }
  code: string
  total: string
  dateCreated: string
  validUntil: string
  stage: string
}

export interface OrdersViewCompany {
  id: number
  orderNum: string
  dateAdded: string
  account: string
  client: { id: number }
  amount: string
  status: string
}

export interface TransactionsViewCompany {
  id: number
  date: string
  account: string
  type: string
  amount: string
  status: string
  description: string
  dr: string
  cr: string
  bal: string
}

export interface SettingsCustomFieldsProps {
  id: number
  name: string
  type: 'textBox' | 'password' | 'dropDown' | 'textArea'
  description: string
  fieldOptions: string[]
  regexpr: string
  showInvoice: number
  value: string
}

export interface ListCustomersData {
  id: number
  account: string
  address?: string
  code: string
  company: CompanyData
  email: string
  group: ListCustomersGroupProps
  phone: string
  img: string
}

interface ListCustomersGroupProps {
  id: number
  name: string
  sort: number
}

export interface CustomerInputsData {
  code: string
  company: CompaniesListProps[]
  group: ListCustomersGroupProps[]
  currency: CurrencyProps[]
  country: string[]
  owner: AdminInfo[]
  customFields: SettingsCustomFieldsProps[]
  type: string[]
  tags: string[]
}

export interface ViewListPagesAndInfo {
  account: string
  img: string
  email: string
  phone: string
  type: { [key: string]: number | null }
}

export interface ViewSummaryTypeData {
  id: number
  account: string
  company: string
  address: string
  amount: string
  autologin: null
  group: string
  balance: string
  city: string
  country: string
  tags: string
  customFields: [{ id: number; name: string; value: string }]
  email: string
  notes: string
  phone: string
  primaryContact: number
  state: string
  totalExpense: number
  totalProfit: number
  zip: string
}

export interface SummaryPageUpdateInfo {
  primaryContact: boolean
  notes: string
  autologin: boolean
  addAmount: string
  returnAmount: string
}

export interface ViewInvoicesTypeData {
  listStatus: []
  invoiceAmount: string
  paidAmount: string
  unpaidAmount: string
  invoice: ViewInvoicesProps[]
}

export interface ViewInvoicesProps {
  id: number
  code: string
  account: string
  total: string
  date: string
  dueDate: string
  status: string
}

export interface ViewOffersTypeData {
  id: number
  account: string
  subject: string
  code: string
  dateCreated: string
  stage: string
  total: string
  validUntil: string
}

export interface ViewFilesTypeData {
  clientFiles: ViewFileProps[]
  listFiles: ViewFileProps[]
}

export interface ViewFileProps {
  id: number
  global: number
  title: string
  type: string
}

export interface ViewLogTypeData {
  id: number
  description: string
  ip: string
  time: string
}

export interface ViewTransactionsTypeData {
  id: number
  account: string
  amount: string
  bal: string
  cr: string
  date: string
  description: string
  dr: string
  payeeid: number
  payerid: number
  status: string
  type: string
}

export interface ViewActivityTypeData {
  id: number
  admin: AdminInfo
  client: UserInfo
  date: string
  icon: string
  message: string
  time: string
}

export interface ViewPasswordManagerTypeData {
  id: number
  name: string
  url: string
  username: string
  password: string
}

export interface ViewEmailTypeData {
  client: { email: string }
  logEmail: ViewEmailProps[]
}

export interface ViewEmailProps {
  id: number
  subject: string
  date: string
}

export interface ViewEmailValuesData {
  title: string
  message: string
}

export interface ViewEditTypeData {
  id: number
  account: string
  address: string
  businessNumber: string
  city: string
  code: string
  company: CompaniesListProps
  country: string
  currency: CurrencyProps
  customFields: SettingsCustomFieldsProps[]
  displayName: string
  email: string
  group: ListCustomersGroupProps
  ownerId: number
  phone: string
  secondaryEmail: string
  state: string
  tags: string[]
  type: string[]
  userName: string
  zip: string
}

export interface SalesInvoicesStatData {
  count: number
  percentage: number
  status: string
  total: string
}

export interface ViewInvoicesRecentData {
  id: number
  code: string
  account: ListCustomersData
  amount: string
  invoiceDate: string
  dueDate: string
  status: string
  type: number
}

export interface SalesBlankData {
  serviceId?: number
  id?: number
  index: number
  service: 'calc'
  description: string
  amount: number
  price: number
  tax: number
  discount: number
  discountType: 'percent' | 'fixed'
}

export interface SalesEditInvoiceBlankData {
  serviceId: number
  id: number
  index: number
  service: 'calc'
  description: string
  amount: number
  price: number
  tax: number
  discount: number
  total: number
  discountType: 'percent' | 'fixed'
}

export interface SalesNewInvoiceFormData {
  invoiceNum: string
  num: string
  status: string
  currency: string
  notes: string
  blankList: SalesBlankData[]
}

export interface SalesNewInvoiceInputData {
  currency: CurrencyProps[]
  client: ListCustomersData[]
  dueDate: string[]
  invoiceNum: string
  num: string
  notes: string
  repeat: string[]
  status: string[]
  service: SalesProductOrServiceData[]
  tax: SalesNewInvoiceTaxProps[]
}

export interface SalesProductOrServiceData {
  id: number
  name: string
  price: string
}

export interface SalesNewInvoiceTaxProps {
  id: number
  isDefault: number
  name: string
  rate: string
}

export interface SalesNewInvoicePriceCalcProps {
  data: SalesNewInvoicePriceCalcDataData[] | null
  result: {
    discount: string
    price: string
    tax: string
    total: string
  } | null
  status: boolean
  message: string
}

interface SalesNewInvoicePriceCalcDataData {
  amount: number
  price: number
  total: number
  description?: string
}

export interface SalesEditInvoiceData {
  id: number
  title: string
  status: string
  invoiceNum: string
  num: string
  receiptNumber: string
  showQuantity: string
  code: string
  client: ListCustomersData
  currency: CurrencyProps
  repeat: number
  date: string
  dueDate: number
  notes: string
}

export interface SalesBlanks {
  blank: SalesEditInvoiceBlankData[]
  blankCalc: BlankCalc
}

export interface BlankCalc {
  discount: string
  price: string
  tax: string
  total: string
}
