/* eslint-disable max-len */

export interface VersionInfo {
  version: string
  description: string
}

export const versions: VersionInfo[] = [
  {
    version: '0.0.37-alpha.37ft',
    description: `
            <ul>
              <li>Реализован новый функционал корзины на Client части</li>
              <li>Реализовали возможность менять часы и тип в Client корзине</li>
              <li>Client теперь может собирать команду для Business Plan</li>
            </ul>
    `,
  },
]
