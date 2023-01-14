import React, { useEffect, useState } from 'react'

export type ToastType = { type: 'error' | 'success'; message: string | null }

const useToast = () => {
  const [toast, setToast] = useState<ToastType>()

  useEffect(() => {
    if (!toast) return

    setTimeout(() => {
      setToast(null)
    }, 2900)
  }, [toast])

  return { toast, setToast }
}

export default useToast
