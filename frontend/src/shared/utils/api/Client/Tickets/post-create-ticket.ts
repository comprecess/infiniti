export const postCreateClientTicket = async (_payload: any) => {
  await new Promise(r => setTimeout(r, 400))
  return { status: true, data: { id: Date.now(), message: 'Ticket submitted (mock)' } }
}
