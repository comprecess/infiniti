export const putUpdateAdminTicket = async (_id: number, _payload: any) => {
  await new Promise(r => setTimeout(r, 400))
  return { status: true, data: { message: 'Ticket updated (mock)' } }
}
