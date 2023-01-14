import clsx from 'clsx'
import React from 'react'
import type { ToastType } from '../../hooks/useToast'
import { capitalizeFirstLetter } from '../../utils'

import './Toast.css'

type ToastProps = {
  toast: ToastType
}

const Toast = ({ toast }: ToastProps) => {
  return (
    <div className={clsx('toast-container', `toast-container--${toast.type}`)}>
      <span >
        {capitalizeFirstLetter(toast.type)}
      </span>
      <p className='toast-container__message'>{toast.message}</p>
    </div>
  )
}

export default Toast
