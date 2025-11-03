/* eslint-disable max-len */

export interface VersionInfo {
  version: string
  description: string
}

export const versions: VersionInfo[] = [
  {
    version: '0.0.26-alpha.26qg',
    description: `
            <ul>
              <li>Добавил блок в клиентский dashboard (Business Plan)</li>
              <li>Добавил модальное окно, которое показывает что вышла обновa на платформу</li>
              <li>Добавил опросник при регистрации + сделал blur</li>
              <li>Добавлена кнопка войти через Google в формы auth</li>
              <li>Добавлена новая карточка Business Plan при конвертации</li>
              <li>В Admin -> Dashboard карточки теперь идут везде в ряд</li>
              <li>Теперь можно использовать checkBox в TextEditor</li>
              <li>Поправил график в Dashboard теперь ровно по столбцу идет + мелкие правки по нему сделал для корректной работы</li>
              <li>Правки кеша PWA</li>
            </ul>
    `,
  },
]
