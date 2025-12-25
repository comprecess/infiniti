/* eslint-disable max-len */

export interface VersionInfo {
  version: string
  description: string
}

export const versions: VersionInfo[] = [
  {
    version: '0.0.39-alpha.39js',
    description: `
            <ul>
              <li>Добавлены проекты на клиенте</li>
            </ul>
    `,
  },
  {
    version: '0.0.40-alpha.40vy',
    description: `
            <ul>
              <li>Изменены все padding в проекте</li>
              <li>Теперь в Invoice в Add Payment при нажатии на Reminder автоматические подставляется в input число</li>
              <li>Client -> Business Plan перенесен на сокеты</li>
              <li>Теперь в Accounting (Deposit, Expense), Payer отображаются только те, что находятся в выбранной компании</li>
            </ul>
    `,
  },
]
