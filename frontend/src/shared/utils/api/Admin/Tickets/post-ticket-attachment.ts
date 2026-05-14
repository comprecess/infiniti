export const postAdminTicketAttachment = async (ticketId: number, file: File) => {
  const formData = new FormData()
  formData.append('file', file)

  const res = await fetch(`/api/v1/resident/support/${ticketId}/attachment`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token') ?? ''}`,
    },
    body: formData,
  })
  return res.json()
}
