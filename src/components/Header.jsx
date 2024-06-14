import React, { useEffect } from 'react'
import siteLogo from '../assets/site_logo.png'

export const Header = () => {

  return (
    <>
    <div className="bg-blue-500 bg-gradient-to-r from-blue-600 to-blue-400 rounded-tr-lg rounded-br-lg shadow-2xl text-white text-left py-3 px-2 md:px-4 header mt-4 mx-[10px] md:mx-[15px]">
      <div className="flex items-center justify-between mx-2 md:mx-[24px]">
        <div className='text-section text-white pr-2'>
          <h2 className='font-bold md:text-lg text-sm'>BI Chile - Alerta Venta Potencial</h2>
          <p className='font-light text-[12px] md:text-sm'>Realizado por Business Analytics - BI Chile</p>
        </div>
        <img className='pb-[5px] md:pb-[10px] max-w-[150px] md:max-w-[150px]' src={siteLogo} width={200} height={40} />
      </div>
    </div>
    </>
  )
}
