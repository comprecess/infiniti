/* eslint-disable max-len */

export interface VersionInfo {
  version: string
  description: string
}

export const versions: VersionInfo[] = [
  {
    version: '0.0.33-alpha.33ft',
    description: `
            <ul>
              <li>Таски перенесены на сокеты</li>
              <li>Новый вид тасков теперь выводятся users в карточке таска</li>
            </ul>
    `,
  },
]
