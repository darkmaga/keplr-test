import React from 'react'

import './ErrorBoundary.css'

type ErrorBoundaryProps = {
  message: string
}

const ErrorBoundary = ({ message }: ErrorBoundaryProps) => {
  return (
    <div>
      <h2 className='text-red'>Error</h2>
      {message}
    </div>
  )
}

export default ErrorBoundary
