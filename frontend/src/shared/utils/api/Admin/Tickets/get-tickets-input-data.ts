import { MOCK_INPUT_DATA } from './_mock-data'

export const getAdminTicketsInputData = async () => {
  await new Promise(r => setTimeout(r, 200))
  return { status: true, data: MOCK_INPUT_DATA }
}
