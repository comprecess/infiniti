/* eslint-disable react-refresh/only-export-components */

import React, { createContext, useContext } from 'react'

import { useWebSocket } from '../../hooks/useWebSocket'
import { getAuthToken } from '../api/get-auth-token'

const WebSocketContext = createContext<any>(null)

export const WebSocketProvider = ({ children }: { children: React.ReactNode }) => {
  const token = getAuthToken()
  const socket = useWebSocket({
    url: import.meta.env.VITE_WEBSOCKET_URL ?? '',
    token,
  })

  return <WebSocketContext.Provider value={socket}>{children}</WebSocketContext.Provider>
}

export const useAppWebSocket = () => useContext(WebSocketContext)
