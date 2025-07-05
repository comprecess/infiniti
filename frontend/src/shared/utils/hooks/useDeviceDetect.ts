import { useEffect, useState } from 'react'
import { UAParser } from 'ua-parser-js'

interface DeviceInfo {
  deviceType: string | null
  deviceModel: string | null
  os: string | null
  browser: string | null
  isMobile: boolean | null
}

export const useDeviceDetect = (): DeviceInfo => {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    deviceType: null,
    deviceModel: null,
    os: null,
    browser: null,
    isMobile: null,
  })

  useEffect(() => {
    const parser = new UAParser()
    const result = parser.getResult()

    setDeviceInfo({
      deviceType: result.device.type || null,
      deviceModel: result.device.model || null,
      os: result.os.name || null,
      browser: result.browser.name || null,
      isMobile: result.device.type === 'mobile' || null,
    })
  }, [])

  return deviceInfo
}
