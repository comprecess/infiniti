import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Text,
  Spinner,
  Flex,
} from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { getEmailTemplates, EmailTemplate } from '../../utils/api/Admin/EmailTemplates/get-email-templates'
import { getRenderEmailTemplate } from '../../utils/api/Admin/EmailTemplates/get-render-email-template'

interface Props {
  isOpen: boolean
  onClose: () => void
  contactId?: number
  onSelect: (subject: string, body: string) => void
}

export const ChooseTemplateModal = ({ isOpen, onClose, contactId, onSelect }: Props) => {
  const [templates, setTemplates] = useState<EmailTemplate[]>([])
  const [loading, setLoading] = useState(false)
  const [applying, setApplying] = useState<number | null>(null)

  useEffect(() => {
    if (!isOpen) return
    setLoading(true)
    getEmailTemplates().then(res => {
      if (res.status) setTemplates(res.data)
      setLoading(false)
    })
  }, [isOpen])

  const handleSelect = async (tpl: EmailTemplate) => {
    setApplying(tpl.id)
    const res = await getRenderEmailTemplate(tpl.id, contactId)
    setApplying(null)
    if (res.status) {
      onSelect(res.data.subject, res.data.body)
      onClose()
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl">
      <ModalOverlay />
      <ModalContent bg="var(--chakra-colors-brand-700, #1a1a2e)" color="white">
        <ModalHeader fontSize="18px">Choose from Template</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          {loading ? (
            <Flex justify="center" py={8}><Spinner /></Flex>
          ) : templates.length === 0 ? (
            <Text color="gray.400" textAlign="center" py={8}>No templates found</Text>
          ) : (
            <Table size="sm" variant="simple">
              <Thead>
                <Tr>
                  <Th color="gray.400">Name</Th>
                  <Th color="gray.400">Subject</Th>
                  <Th></Th>
                </Tr>
              </Thead>
              <Tbody>
                {templates.map(tpl => (
                  <Tr key={tpl.id}>
                    <Td color="white" fontWeight={500}>{tpl.name}</Td>
                    <Td color="gray.300" fontSize="13px" maxW="300px" isTruncated>{tpl.subject}</Td>
                    <Td>
                      <Button
                        size="sm"
                        colorScheme="blue"
                        isLoading={applying === tpl.id}
                        onClick={() => handleSelect(tpl)}
                      >
                        Use
                      </Button>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
