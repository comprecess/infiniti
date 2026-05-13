export const postClientTicketReply = async (_ticketId: number, _payload: any) => {
  await new Promise(r => setTimeout(r, 400))
  return {
    status: true,
    data: {
      id: Date.now(),
      body: _payload?.body ?? '',
      author_info: { name: 'You', type: 'client' },
      created_at: new Date().toISOString(),
    },
  }
}
