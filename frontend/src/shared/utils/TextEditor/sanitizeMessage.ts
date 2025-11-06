import DOMPurify from 'dompurify'

export const sanitizeMessage = (value: string): string => {
  const clean = DOMPurify.sanitize(value, {
    ALLOWED_TAGS: [
      'google-sheets-html-origin',
      'colgroup',
      'col',
      'iframe',
      'p',
      'br',
      'b',
      'u',
      's',
      'i',
      'em',
      'strong',
      'a',
      'ul',
      'ol',
      'li',
      'blockquote',
      'span',
      'div',
      'img',
      'table',
      'thead',
      'tbody',
      'tr',
      'th',
      'td',
      'caption',
      'hr',
      'input',
    ],
    ALLOWED_ATTR: [
      'src',
      'href',
      'target',
      'width',
      'height',
      'frameborder',
      'allowfullscreen',
      'style',
      'type',
      'xmlns',
      'cellspacing',
      'cellpadding',
      'data-sheets-baot',
      'border',
      'dir',
      'id',
      'rowspan',
      'colspan',
      'data-sheets-root',
      'checked',
    ],
  })

  const doc = new DOMParser().parseFromString(clean, 'text/html')

  doc.body.querySelectorAll<HTMLElement>('*').forEach(el => {
    const style = el.getAttribute('style')
    if (style) {
      const cleaned = style
        .split(';')
        .map(rule => rule.trim())
        .filter(rule => rule && !rule.startsWith('color'))
        .join('; ')

      if (cleaned) {
        el.setAttribute('style', cleaned)
      } else {
        el.removeAttribute('style')
      }
    }
  })

  return doc.body.innerHTML
}
