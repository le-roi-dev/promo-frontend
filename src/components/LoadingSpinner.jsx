import React from 'react'
import { MetroSpinner } from 'react-spinners-kit';


export const LoadingSpinner = ({isLoading}) => {
  return (
    <div className='flex justify-center items-center z-50 first-loading-logo'>
        <MetroSpinner size={45} color="#3e3e3e" loading={isLoading} />
    </div>
  )
}
