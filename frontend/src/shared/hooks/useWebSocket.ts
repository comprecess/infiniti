/* eslint-disable no-console */
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
  const [isAuth, setIsAuth] = useState(false)
  const [hasReachedReconnectLimit, setHasReachedReconnectLimit] =
    useState(false)
  const [data, setData] = useState<any>(null)

  const wsRef = useRef<WebSocket | null>(null)
  const handlersRef = useRef<Record<string, MessageHandler>>({})
  const reconnectAttemptsRef = useRef(0)

  const connect = useCallback(() => {
    if (
      wsRef.current &&
      (wsRef.current.readyState === WebSocket.OPEN ||
        wsRef.current.readyState === WebSocket.CONNECTING)
    ) {
      console.log('WebSocket: already connecting or connected')

      return
    }

    if (reconnectAttemptsRef.current >= maxReconnectAttempts) {
      console.warn('WebSocket: max reconnect attempts reached')

      setHasReachedReconnectLimit(true)

      return
    }

    console.log(
      `WebSocket: trying to connect to ${url} (attempt ${
        reconnectAttemptsRef.current + 1
      })`,
    )

    try {
      wsRef.current = new WebSocket(url)
    } catch (err) {
      console.error('WebSocket: constructor failed', err)

      return
    }

    wsRef.current.onopen = () => {
      console.log('WebSocket: connected')

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

    wsRef.current.onclose = event => {
      console.warn(
        `WebSocket: closed (code=${event.code}, reason=${event.reason})`,
      )

      setIsConnected(false)
      setIsAuth(false)

      reconnectAttemptsRef.current += 1

      if (reconnectAttemptsRef.current < maxReconnectAttempts) {
        setTimeout(connect, reconnectInterval)
      } else {
        console.warn('WebSocket: max reconnect attempts exceeded')

        setHasReachedReconnectLimit(true)
      }
    }

    wsRef.current.onerror = event => {
      console.error('WebSocket: error', event)
    }

    wsRef.current.onmessage = event => {
      try {
        const data = JSON.parse(event.data)

        setData(data)

        if (data.c === 'auth') {
          if (data.code === 200) {
            setIsAuth(true)
            console.log('✅ Auth success')
          } else {
            setIsAuth(false)
            console.warn('❌ Auth failed', data)
          }
        }

        if (data.c && handlersRef.current[data.c]) {
          handlersRef.current[data.c](data)
        }
      } catch (err) {
        console.error('WebSocket message parse error:', err)
      }
    }
  }, [url, token, reconnectInterval, maxReconnectAttempts])

  useEffect(() => {
    connect()

    return () => {
      console.log('WebSocket: cleanup, closing connection')
      wsRef.current?.close()
    }
  }, [connect])

  const on = useCallback((command: string, handler: MessageHandler) => {
    handlersRef.current[command] = handler
  }, [])

  return {
    isConnected,
    isAuth,
    data,
    hasReachedReconnectLimit,
    on,
  }
}
