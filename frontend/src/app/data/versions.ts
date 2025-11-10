/* eslint-disable max-len */

export interface VersionInfo {
  version: string
  description: string
}

export const versions: VersionInfo[] = [
  {
    version: '0.0.32-alpha.32sq',
    description: `
            <ul>
              <li>Изменен функционал проектов, добавлены новые поля</li>
              <li>В тасках теперь Users (вместо Related Customer)</li>
              <li>На клиентской части добавлен токен авторизации к документам</li>
              <li>Добавлена карточка Recent Documents в клиентский дашборд</li>
              <li>Изменены стили клиентского дашборда</li>
            </ul>
    `,
  },
]
