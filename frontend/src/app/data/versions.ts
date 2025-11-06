/* eslint-disable max-len */

export interface VersionInfo {
  version: string
  description: string
}

export const versions: VersionInfo[] = [
  {
    version: '0.0.30-alpha.30eg',
    description: `
            <ul>
              <li>Поправлен текст в форме создания Supplier</li>
              <li>При ошибке авторизации через Google теперь выводиться сообщение от backend, а не выбивает страницу ошибки</li>
              <li>При ошибке в любой форме auth убрал перевод на страницы с ошибкой, теперь просто выводиться уведомление с ошибкой</li>
              <li>Теперь длинный task на мобилке скролится + пробовал сделать нажатие checkbox, пока не вышло</li>
              <li>Опросник сохраняется в local storage + каждый опросник имеет свой id и он сохраняется отдельно</li>
              <li>Готово сохранение форм в local storage для конкретного клиента</li>
            </ul>
    `,
  },
]
