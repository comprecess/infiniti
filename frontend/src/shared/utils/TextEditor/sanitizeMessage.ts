import DOMPurify from 'dompurify'

export const sanitizeMessage = (value: string): string => {
  return DOMPurify.sanitize(value, {
    ALLOWED_TAGS: [
      'iframe',
      'p',
      'br',
      'b',
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
    ],
    ALLOWED_ATTR: [
      'src',
      'width',
      'height',
      'frameborder',
      'allowfullscreen',
    ],
  })
}
