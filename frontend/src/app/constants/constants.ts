export const authTokenString = 'authToken/infiniti'
export const profileInfoString = 'profileInfo/infiniti'
export const userTalentsPageString = 'userTalentsPage/infiniti'
export const userModelsPageString = 'userModelsPage/infiniti'

export const page = '?page='

export const roles = {
  client: 'Client',
  admin: 'Admin',
}

export interface MessageChatGPT {
  id: number
  message: string
  create: string
  type: 'out' | 'in'
  isLoadingMessage?: boolean
}

export interface LanguagesList {
  id: number
  name: string
  nameId: string
  values: ValuesProps[]
}

export interface RolesAccess {
  all: number
  create: number
  delete: number
  edit: number
  view: number
}

export interface RolesAccessObject {
  id: number
  shortname: string
  permission: RolesAccessObjectPermission
  all: number
  create: number
  delete: number
  edit: number
  view: number
}

export interface RolesAccessObjectPermission {
  id: number
  shortname: string
  name: string
}

export interface FiltersState {
  [key: string]: (string | number | null)[]
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

export interface ClientInvoiceData {
  id: number
  amount: string
  blockEdit: boolean
  code: string
  dueDate: string
  invoiceDate: string
  status: string
  type: number
}
export interface ClientOfferData {
  id: number
  code: string
  dateCreated: string
  stage: string
  subject: string
  total: string
  validUntil: string
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
  roleId: number
  role: {
    [key: string]: {
      view: number
    }
  }
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
  email: string
  zip: string
}

export interface TalentData {
  id: number
  img: string
  inCart: number
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
  inCart: number
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
  status: boolean
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
  dateTime: string
  noDelete: number
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
  blockEdit: boolean
}

export interface SalesBlankData {
  serviceId?: number
  id?: number
  index: number
  service: 'calc' | 'serviceProduct'
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
  service: 'calc' | 'serviceProduct'
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
  checkPublic: number
  invoiceNum: string
  num: string
  notes: string
  repeat: string[]
  status: string[]
  service: string[]
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
  checkPublic: number
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

export interface SalesViewInvoiceData {
  id: number
  blank: SalesEditInvoiceBlankData[]
  blankCalc: BlankCalc
  client: FullInfoClient
  code: string
  listStatus: string[]
  company: {
    companyAddress: string
    companyName: string
  }
  offer: SalesViewOfferData
  checkPublic: number
  currency: CurrencyProps
  date: string
  dueDate: string
  email: string
  invoiceNum: string
  notes: string
  num: string
  phone: string
  receiptNumber: string
  repeat: string
  showQuantity: string
  status: string
  title: string
  token: string
  blockEdit: boolean
  pdf: string
  transactions: SalesViewInvoiceTransactions[]
  payList?: SalesViewInvoicePayList[]
  documents: SalesViewInvoiceDocuments[]
}

export interface SalesViewInvoiceDocuments {
  id: number
  global: number
  link: string
  title: string
  type: string
}

export interface SalesViewInvoiceTransactions {
  account: string
  amount: string
  date: string
  description: string
}

export interface SalesViewInvoicePayList {
  id: number
  idName: string
  name: string
  value: string
}

export interface FullInfoClient {
  id: number
  account: string
  address: string
  amount: string
  autologin: string
  balance: string
  city: string
  company: string
  country: string
  customFields: SettingsCustomFieldsProps[]
  email: string
  group: string
  notes: string
  phone: string
  primaryContact: number
  state: string
  tags: string
  totalExpense: string
  totalProfit: string
  zip: string
}

export interface SalesInvoiceEmailTemplateData {
  adminEmail: string
  file: string
  message: string
  subject: string
  variable: { code: string; client_email: string }
}

export interface SalesOffersListData {
  id: number
  account: ListCustomersData
  code: string
  dateCreated: string
  stage: string
  subject: string
  total: string
  validUntil: string
}

export interface SalesOfferInputData {
  client: ListCustomersData[]
  tax: SalesNewInvoiceTaxProps[]
  service: string[]
  stage: string[]
  num: string
  offerNum: string
}

export interface SalesNewOfferFormData {
  blankList: SalesBlankData[]
  num: string
  offerNum: string
  stage: string
}

export interface SalesViewOfferData {
  id: number
  client: FullInfoClient
  blank: SalesEditInvoiceBlankData[]
  blankCalc: BlankCalc
  code: string
  stage: string
  listStage: string[]
  dateCreated: string
  notes: string
  num: string
  offerNum: string
  pdf: string
  proposal: string
  subject: string
  token: string
  validUntil: string
  status: { publicButton: boolean }
  company: {
    companyAddress: string
    companyName: string
  }
  checkPublic: number
}

export interface SalesEditOfferData {
  id: number
  client: FullInfoClient
  blank: SalesEditInvoiceBlankData[]
  blankCalc: BlankCalc
  code: string
  dateCreated: string
  notes: string
  num: string
  offerNum: string
  pdf: string
  proposal: string
  stage: string
  subject: string
  token: string
  validUntil: string
  checkPublic: number
}

export interface SalesOfferEmailTemplateData {
  subject: string
  message: string
  file: string
  adminEmail: string
  variable: { code: string; client_email: string }
}

export interface SettingsRolesData {
  id: number
  name: string
}

export interface SettingsRoleFormData {
  permissionId: number
  view: number
  edit: number
  create: number
  delete: number
  all: number
}

export interface DashboardData {
  Expense: {
    thisMonth: string
    today: string
    total: string
  }
  Income: {
    thisMonth: string
    today: string
    total: string
  }
  newWorth: string
  graph: DashboardDataJson
  client: 36
  company: 11
  leads: 18
}

interface DashboardDataEntry {
  Income: number
  Expense: number
}

interface DashboardDataJson {
  [key: string]: DashboardDataEntry
}

export interface SettingsUsersData {
  id: 8
  city: string
  country: string
  email: string
  fullName: string
  img: string
  departments: { id: number; name: string }[]
  phoneNumber: string
  role: { name: string }
  state: string
  zip: string
}

export interface SettingsUserInputData {
  role: { id: number; name: string }[]
  country: { [key: string]: string }
  department: { id: number; name: string }[]
  localization: { name: string; iso_code: string }[]
  payFrequency: string[]
}

export interface SettingsEditUserData {
  id: number
  address: string
  amount: string
  city: string
  country: string
  dateHired: string
  departments: { id: number; name: string }[]
  email: string
  emailNotify: number
  fullName: string
  img: string
  jobTitle: string
  language: string
  payFrequency: string
  phoneNumber: string
  role: { id: number; name: string }
  smsNotify: number
  state: string
  summary: string
  zip: string
}

export interface TalentsData {
  id: number
  name: string
  img: string
  specialization: string
  lvl: string
  priceHour: string
  priceDay: string
}

export interface TalentFormData {
  name: string
  file: FormData | null
  birthDay: string
  priceDay: number
  priceHour: number
  language: number[]
  gender: number
  lvl: number
  timezone: number
  specialization: string[]
  industries: string[]
  keySkills: string[]
  allSkills: string[]
  educationName: string
  rate: number
  active: number
  educationSpecialization: string
  educationDegree: string
  educationGraduation: string
  blockExperience: TalentProjectsExperience[]
}

export interface TalentProjectsExperience {
  id?: number
  index: number
  name: string
  position: string
  periodFrom: string
  periodTo: string
  responsibilities: string
}

export interface CustomersFilesData {
  id: number
  global: number
  link: string
  title: string
  type: string
  client?: { id: number; account: string }
  update: string
}

export interface TalentsInputData {
  allSkills: ValuesProps[]
  gender: ValuesProps[]
  industries: ValuesProps[]
  language: {
    id: number
    children: LanguagesList[]
  }[]
  owner: { id: number; account: string; email: string }[]
  client: { id: number; account: string; email: string }[]
  keySkills: ValuesProps[]
  lvl: ValuesProps[]
  specialization: ValuesProps[]
  timezone: ValuesProps[]
}

export interface TalentEditInfoData {
  id: number
  active: number
  img: string
  name: string
  blockExperience: TalentProjectsExperience[]
  birthDay: string
  property: PropertyArray
}

type PropertyArray = Array<Partial<Property>>

interface Property {
  industries?: ValuesProps[]
  keySkills?: ValuesProps[]
  allSkills?: ValuesProps[]
  priceHour?: ValuesProps[]
  priceDay?: ValuesProps[]
  timezone?: ValuesProps[]
  gender?: ValuesProps[]
  lvl?: ValuesProps[]
  specialization?: ValuesProps[]
  educationName?: ValuesProps[]
  educationSpecialization?: ValuesProps[]
  educationDegree?: ValuesProps[]
  educationGraduation?: ValuesProps[]
  rate?: ValuesProps[]
  [key: string]: ValuesProps[] | undefined
}

export interface TalentsListCartsData {
  id: number
  date: string
  specializations: string
  total: string
  subTotal: string
  subTax: string
  secret: string
  cartItems: CartItem[]
  user: { id: number; account: string; img: string }
}

export interface CartItem {
  id: number
  amount: number
  nameType: NameIdType
  price: string
  total: string
  tax: string
  taxesInclude: number
  talent: {
    id: number
    name: string
    img: string
    specialization: string
    property: PropertyArray
  }
}

export interface BusinessPlanItemData {
  id: number
  companyName: string
  exSummary: string
}

export interface BusinessPlanNewPlanFormData {
  companyName: string
  name: string
  email: string
  phone: string
  date: string
  website: string
  description: string
  exSummary: string
  mAnalysis: string
  management: string
  product: string
  marketing: string
  budget: string
  investment: string
  finance: string
  appendix: string
}

export interface BusinessPlanBusinessModelData {
  id: number
  category: ValuesProps[]
  preview: string
  content: string
  description: string
  fullDescription: string
  age: string
  industries: ValuesProps[]
  price: string
  start: string
  technologies: ValuesProps[]
  title: string
  profitability: ValuesProps[]
  location: ValuesProps[]
  marketAnalysis: string
  financialModel: string
  currentInvestors: string
  stagesImplementation: string
  partnershipOptions: string
}

export interface BusinessPlanBusinessModelFormData {
  category: string[]
  description: string
  fullDescription: string
  age: string
  industries: string[]
  price: string
  start: string
  technologies: string[]
  title: string
  profitability: number
  location: string[]
  preview?: string
  content?: string
  marketAnalysis: string
  financialModel: string
  currentInvestors: string
  stagesOfImplementation: string
  partnershipOptions: string
}

export interface BusinessPlanBusinessModelEditData {
  id: number
  title: string
  description: string
  fullDescription: string
  start: string
  content: null
  preview: null
  property: {
    [key: string]: ValuesProps[]
  }[]
}

export interface BusinessModelInputData {
  access: RolesAccess
  category: ValuesProps[]
  industries: ValuesProps[]
  location: ValuesProps[]
  profitability: ValuesProps[]
  technologies: ValuesProps[]
}
