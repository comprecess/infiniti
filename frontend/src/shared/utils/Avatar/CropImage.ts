export const cropImageToSquare = (file: File): Promise<File> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = event => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const size = Math.min(img.width, img.height)
        canvas.width = size
        canvas.height = size
        const ctx = canvas.getContext('2d')
        ctx?.drawImage(
          img,
          (img.width - size) / 2,
          (img.height - size) / 2,
          size,
          size,
          0,
          0,
          size,
          size,
        )
        canvas.toBlob(blob => {
          if (blob) {
            const croppedFile = new File([blob], file.name, {
              type: file.type,
            })
            resolve(croppedFile)
          } else {
            reject(new Error('Canvas is empty'))
          }
        }, file.type)
      }
      img.src = event.target?.result as string
    }
    reader.onerror = error => reject(error)
    reader.readAsDataURL(file)
  })
}
