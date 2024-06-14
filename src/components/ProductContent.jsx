import React, { useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';

export const ProductContent = ({ data }) => {
    const iconColor = '#0EA292'; //checkbox icon color

    const iconStyle = {
      color: iconColor,
      fontSize: '24px'
    };
    const imgUrl = "https://sodimac.scene7.com/is/image/SodimacCL/" + data?.item_sku_num + "?fmt=jpg&fit=constrain,1&wid=200&hei=200";

    const formatter = new Intl.NumberFormat('en-US', {
        style: 'decimal',
        useGrouping: true,
        maximumFractionDigits: 2
      });
    const formatterInt = new Intl.NumberFormat('en-US', {
        style: 'decimal',
        useGrouping: true,
        maximumFractionDigits: 0
      });
    let trafficLight = ""
    if(data.venta_potencial >= 1000000) {
        trafficLight = "bg-red-600 border border-gray-200";
    } else if(data.venta_potencial >= 500000 && data.venta_potencial < 1000000 ) {
        trafficLight = "bg-orange-500 border border-gray-200"
    } else {
        trafficLight = "bg-yellow-500 border border-gray-200"
    }

    useEffect(() => {
        console.log('updating inside data....')
    },[data])
  return (
        <div className='product-detail-container mb-6'>
            <div className='w-full border-b-2 pb-2 border-gray-700 font-bold text-lg md:text-xl mt-2 mb-4 text-gray-700'>
                Alerta generada
            </div>
            <div className='w-full flex md:flex-row content-section'>
                <div className='photo-section md:w-[25%] min-w-[180px] md:w-min-w-[250] mb-3 pr-2 md:pr-0'>
                    <div className='w-full min-w-full mb-2 flex flex-row items-center justify-start semaforo-check'>
                        <div className='semaforo flex items-center'>
                            <div className='font-bold text-lg text-[#0EA292]'>Semáforo</div>
                            <div className={`ml-4 w-[24px] h-[24px] rounded-full ${trafficLight}`}></div>
                        </div>
                        {parseInt(data.sku_ranking) <= 20 ? <div className='top-check flex items-center'><div className={`font-bold text-[#0c9587] ml-[18px] sm:ml-[10px] lg:ml-[20px] text-lg`}>Top {data.sku_ranking}</div><div className='mx-2'><FontAwesomeIcon style={iconStyle} icon={faCheckCircle} /></div></div> : null}
                    </div>
                        {data?.item_sku_num && <img src={imgUrl} className='w-full pr-4' width={200} height={'auto'} alt="product_image" />}    
                    </div>
                <div className='w-[100%] md:w-[75%] flex flex-col md:flex-row table-block-container'>
                    <div className='first-table scrollable mr-3 md:mr-5'>
                        <p className='text-lg text-[#0EA292] mb-3 font-bold'>Información SKU Alertado</p>
                        <table className='custom_table_first'>
                            <tbody>
                                <tr className='py-1 border-gray-500 border-b'>
                                    <td className='p-2 bg-[#C7EBEB] font-bold'>SKU</td>
                                    <td className='p-2 bg-[#C7EBEB] font-bold'>{data?.item_sku_num ? data.item_sku_num : ''}</td>
                                </tr>
                                <tr className='py-1 border-gray-500 border-b'>
                                    <td className='p-2 bg-[#C7EBEB] font-bold'>Descripción</td>
                                    <td className='p-2 bg-[#C7EBEB] font-bold'>{data?.product_name ? data.product_name : ''}</td>
                                </tr>
                                <tr className='py-1 border-gray-500 border-b'>
                                    <td className='p-2'>Departamento</td>
                                    <td className='p-2'>{data?.hier_department_name ? data.hier_department_name : ''}</td>
                                </tr>
                                <tr className='py-1 border-gray-500 border-b'>
                                    <td className='p-2'>Familia</td>
                                    <td className='p-2'>{data?.hier_family_name ? data.hier_family_name : ''}</td>
                                </tr>
                                <tr className='py-1 border-gray-500 border-b'>
                                    <td className='p-2'>Subfamilia</td>
                                    <td className='p-2'>{data?.hier_subfamily_name ? data.hier_subfamily_name : ''}</td>
                                </tr>
                                <tr className='py-1 border-gray-500 border-b'>
                                    <td className='p-2'>Grupo</td>
                                    <td className='p-2'>{data?.grupo ? data.grupo : ''}</td>
                                </tr>
                                <tr className='py-1 border-gray-500 border-b'>
                                    <td className='p-2'>Conjunto</td>
                                    <td className='p-2'>{data?.conjunto ? data.conjunto : ''}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className='second-table scrollable'>
                    <p className='text-lg text-[#0EA292] mb-3 font-bold'>Información Alerta</p>
                        <table className='custom-table'>
                            <tbody>
                                <tr className='py-1 border-gray-500 border-b '>
                                    <td className='p-2 bg-[#C7EBEB] font-bold'>Venta Potencial [$]</td>
                                    <td className='p-2 bg-[#C7EBEB] font-bold'>{data.venta_potencial ? formatterInt.format(parseInt(data.venta_potencial)) : ''}</td>
                                </tr>
                                <tr className='py-1 border-gray-500 border-b'>
                                    <td className='p-2'>Venta Real [Unid.]</td>
                                    <td className='p-2'>{data?.venta_total ? formatter.format(data.venta_total) : ''}</td>
                                </tr>
                                <tr className='py-1'>
                                    <td className='p-2'>Venta esperada [Unid.]</td>
                                    <td className='p-2'>{data?.venta_esperada ? formatter.format(data.venta_esperada) : ''}</td>
                                </tr>
                            </tbody>
                        </table>
                        <p className='mt-2'> * Datos calculados a partir de semana anterior</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
