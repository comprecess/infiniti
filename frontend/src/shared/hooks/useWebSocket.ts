import { useCallback, useEffect, useRef, useState } from 'react'

type MessageHandler = (data: any) => void

interface WebSocketOptions {
  url: string
  token?: string
  reconnectInterval?: number
  maxReconnectAttempts?: number
}

export const useWebSocket = ({
  url,
  token,
  reconnectInterval = 5000,
  maxReconnectAttempts = 5,
}: WebSocketOptions) => {
  const [isConnected, setIsConnected] = useState(false)
  const [hasReachedReconnectLimit, setHasReachedReconnectLimit] =
    useState(false)

  const wsRef = useRef<WebSocket | null>(null)
  const handlersRef = useRef<Record<string, MessageHandler>>({})
  const reconnectAttemptsRef = useRef(0)

  const connect = useCallback(() => {
    if (
      wsRef.current &&
      (wsRef.current.readyState === WebSocket.OPEN ||
        wsRef.current.readyState === WebSocket.CONNECTING)
    ) {
      return
    }

    if (reconnectAttemptsRef.current >= maxReconnectAttempts) {
      console.warn('Max reconnect attempts reached. Giving up.')
      setHasReachedReconnectLimit(true)

      return
    }

    wsRef.current = new WebSocket(url)

    wsRef.current.onopen = () => {
      setIsConnected(true)
      reconnectAttemptsRef.current = 0
      setHasReachedReconnectLimit(false)

      if (token) {
        wsRef.current?.send(
          JSON.stringify({
            c: 'auth',
            data: { token },
          }),
        )
      }
    }

    wsRef.current.onclose = () => {
      setIsConnected(false)
      reconnectAttemptsRef.current += 1

      if (reconnectAttemptsRef.current < maxReconnectAttempts) {
        setTimeout(connect, reconnectInterval)
      } else {
        console.warn('WebSocket closed. Max reconnect attempts exceeded.')
        setHasReachedReconnectLimit(true)
      }
    }

    wsRef.current.onmessage = event => {
      try {
        const msg = JSON.parse(event.data)
        const { c, data } = msg

        if (c && handlersRef.current[c]) {
          handlersRef.current[c](data)
        }
      } catch (err) {
        console.error('WebSocket message parse error:', err)
      }
    }
  }, [url, token, reconnectInterval, maxReconnectAttempts])

  useEffect(() => {
    connect()

    return () => {
      wsRef.current?.close()
    }
  }, [connect])

  return { isConnected, hasReachedReconnectLimit }
}
