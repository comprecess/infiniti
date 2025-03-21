import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useContext,
  useState,
} from 'react'

interface ChatGPTContextType {
  chatGPTChangeForm: boolean
  setChatGPTChangeForm: Dispatch<SetStateAction<boolean>>
}

const ChatGPTContext = createContext<ChatGPTContextType | undefined>(
  undefined,
)

// eslint-disable-next-line react-refresh/only-export-components
export const useChatGPT = () => {
  const context = useContext(ChatGPTContext)

  if (!context) {
    throw new Error('useChatGPT must be used within a ChatGPTProvider')
  }

  return context
}

export const ChatGPTProvider = ({ children }: PropsWithChildren) => {
  const [chatGPTChangeForm, setChatGPTChangeForm] =
    useState<boolean>(false)

  return (
    <ChatGPTContext.Provider
      value={{ chatGPTChangeForm, setChatGPTChangeForm }}
    >
      {children}
    </ChatGPTContext.Provider>
  )
}
