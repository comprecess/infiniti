import {
  Box, Button, Flex, IconButton, Modal, ModalBody, ModalCloseButton,
  ModalContent, ModalFooter, ModalHeader, ModalOverlay, Table, Tbody,
  Td, Textarea, Th, Thead, Tr, useDisclosure, useToast, Input, Text,
} from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { EmailTemplate, getEmailTemplates } from '../../../../shared/utils/api/Admin/EmailTemplates/get-email-templates'
import { postEmailTemplate } from '../../../../shared/utils/api/Admin/EmailTemplates/post-email-template'
import { patchEmailTemplate } from '../../../../shared/utils/api/Admin/EmailTemplates/patch-email-template'
import { deleteEmailTemplate } from '../../../../shared/utils/api/Admin/EmailTemplates/delete-email-template'
import { RecentCard } from '../../../../widgets/RecentCard/RecentCard'
import styles from './EmailTemplatesPage.module.scss'

const EMPTY = { name: '', subject: '', body: '' }

export const AdminEmailTemplatesPage = () => {
  const [templates, setTemplates] = useState<EmailTemplate[]>([])
  const [editing, setEditing] = useState<EmailTemplate | null>(null)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast()

  const load = () => getEmailTemplates().then(r => { if (r.status) setTemplates(r.data) })

  useEffect(() => { load() }, [])

  const openNew = () => { setEditing(null); setForm(EMPTY); onOpen() }
  const openEdit = (tpl: EmailTemplate) => { setEditing(tpl); setForm({ name: tpl.name, subject: tpl.subject, body: tpl.body }); onOpen() }

  const handleSave = async () => {
    if (!form.name || !form.subject || !form.body) {
      toast({ title: 'All fields are required', status: 'warning', duration: 2000 }); return
    }
    setSaving(true)
    const res = editing
      ? await patchEmailTemplate(editing.id, form)
      : await postEmailTemplate(form)
    setSaving(false)
    if (res.status) {
      toast({ title: editing ? 'Updated' : 'Created', status: 'success', duration: 2000 })
      load(); onClose()
    } else {
      toast({ title: 'Error', description: (res as any).message, status: 'error', duration: 3000 })
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this template?')) return
    setDeletingId(id)
    await deleteEmailTemplate(id)
    setDeletingId(null)
    load()
    toast({ title: 'Deleted', status: 'info', duration: 2000 })
  }

  return (
    <div className={styles.wrapper}>
      <section className={styles.section}>
        <RecentCard title="Email Templates" style={styles.card}>
          <Flex justify="flex-end" mb={4}>
            <Button colorScheme="blue" size="sm" onClick={openNew}>+ Add Template</Button>
          </Flex>
          {templates.length === 0 ? (
            <Text color="gray.400" textAlign="center" py={8}>No templates yet</Text>
          ) : (
            <Table size="sm" variant="simple">
              <Thead>
                <Tr>
                  <Th color="white">Name</Th>
                  <Th color="white">Subject</Th>
                  <Th></Th>
                </Tr>
              </Thead>
              <Tbody>
                {templates.map(tpl => (
                  <Tr key={tpl.id}>
                    <Td color="white" fontWeight={500}>{tpl.name}</Td>
                    <Td color="gray.300" fontSize="14px" maxW="400px" isTruncated>{tpl.subject}</Td>
                    <Td>
                      <Flex gap={2} justify="flex-end">
                        <Button size="xs" variant="outline" colorScheme="blue" onClick={() => openEdit(tpl)}>Edit</Button>
                        <Button size="xs" variant="outline" colorScheme="red" isLoading={deletingId === tpl.id} onClick={() => handleDelete(tpl.id)}>Delete</Button>
                      </Flex>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          )}
        </RecentCard>
      </section>

      <Modal isOpen={isOpen} onClose={onClose} size="2xl" blockScrollOnMount={false}>
        <ModalOverlay />
        <ModalContent bg="var(--chakra-colors-brand-700, #1a1a2e)" color="white">
          <ModalHeader>{editing ? 'Edit Template' : 'New Template'}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex direction="column" gap={3}>
              <Box>
                <Text mb={1} fontSize="14px" color="gray.300">Name</Text>
                <Input
                  placeholder="e.g. Welcome Email"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  bg="whiteAlpha.100" border="1px solid" borderColor="whiteAlpha.300" color="white"
                />
              </Box>
              <Box>
                <Text mb={1} fontSize="14px" color="gray.300">Subject</Text>
                <Input
                  placeholder="e.g. Welcome, {name}!"
                  value={form.subject}
                  onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                  bg="whiteAlpha.100" border="1px solid" borderColor="whiteAlpha.300" color="white"
                />
              </Box>
              <Box>
                <Text mb={1} fontSize="14px" color="gray.300">
                  Body <Text as="span" color="gray.500" fontSize="12px">(HTML supported · variables: {'{name}'} {'{email}'} {'{company}'} {'{business_name}'})</Text>
                </Text>
                <Textarea
                  placeholder="<p>Hi {name},</p>..."
                  value={form.body}
                  onChange={e => setForm(f => ({ ...f, body: e.target.value }))}
                  rows={12}
                  bg="whiteAlpha.100" border="1px solid" borderColor="whiteAlpha.300" color="white"
                  fontFamily="monospace" fontSize="13px"
                />
              </Box>
            </Flex>
          </ModalBody>
          <ModalFooter gap={2}>
            <Button variant="ghost" onClick={onClose} color="gray.300">Cancel</Button>
            <Button colorScheme="blue" isLoading={saving} onClick={handleSave}>Save</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  )
}
