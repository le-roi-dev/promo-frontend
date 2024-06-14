import React from 'react'

const AnsweredItem = ({content, setSelectedProduct}) => {
    const imgUrl = "https://sodimac.scene7.com/is/image/SodimacCL/" + content?.item_sku_num + "?fmt=jpg&fit=constrain,1&wid=200&hei=200";
    const formatterInt = new Intl.NumberFormat('en-US', {
        style: 'decimal',
        useGrouping: true,
        maximumFractionDigits: 0
      });
  return (
    <div className='mx-2 bg-slate-200 w-full mt-1 hover:bg-slate-400 hover: cursor-pointer' onClick={() => setSelectedProduct(content)}>
        <div className='flex flex-row mobile-edit-modal'>
            <div className='w-[150px] p-2 sm-img-div'><img className='border border-gray-300' src={imgUrl} alt={content.item_sku_num} /></div>
            <div className='flex justify-between w-full'>
                <div className='ml-2 md:ml-3 py-2 flex flex-col justify-between mt-4 mb-4 sm-large-text mr-3'>
                    <div className='font-bold'>{content?.product_name}</div>
                    <div>
                        <div className=''><span className='font-bold'>SKU: </span>{content?.item_sku_num}</div>
                        <div className=''><span className='font-bold'>Familia: </span>{content?.hier_family_name}</div>
                    </div>
                </div>
                <div className='ml-2 md:ml-3 py-2 flex flex-col justify-between mt-4 mb-4 basis-64 mr-2 sm-large-text'>
                    <div className=''><span className='font-bold'>N° Alerta: </span>{content?.sku_ranking} / ({content?.total_length})</div>
                    <div>
                        <div className=''><span className='font-bold'>Venta Potencial [$]: </span>{ formatterInt.format(parseInt(content?.venta_potencial))}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default AnsweredItem