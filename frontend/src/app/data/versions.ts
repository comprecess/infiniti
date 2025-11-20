/* eslint-disable max-len */

export interface VersionInfo {
  version: string
  description: string
}

export const versions: VersionInfo[] = [
  {
    version: '0.0.35-alpha.35ra',
    description: `
            <ul>
              <li>Обновлена таблица контроля времени в тасках, так как новые поля</li>
              <li>Добавлено удаление и редактирование времени в тасках</li>
              <li>Добавлены логи в тасках</li>
              <li>Добавлены логи в проектах</li>
            </ul>
    `,
  },
]
