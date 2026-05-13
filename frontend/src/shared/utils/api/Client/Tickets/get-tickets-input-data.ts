import { MOCK_CLIENT_INPUT_DATA } from './_mock-data'

export const getClientTicketsInputData = async () => {
  await new Promise(r => setTimeout(r, 200))
  return { status: true, data: MOCK_CLIENT_INPUT_DATA }
}
