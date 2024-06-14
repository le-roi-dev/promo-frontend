import React, { useState, useEffect, useRef } from 'react'
import axios from '../connection/axios';
import { getSkuRanking } from './utils/updateAllState';
import { showToastMessage } from './FormBody';


const EditProduct = ({content, setSelectedProduct, responseCacheKey, setAllProducts }) => {
    const imgUrl = "https://sodimac.scene7.com/is/image/SodimacCL/" + content?.item_sku_num + "?fmt=jpg&fit=constrain,1&wid=200&hei=200";
    const [editFormData, setEditFormData] = useState(content)
    const [fileNames, setFileNames] = useState({first: content.antesName, second: content.despuesName, third: content.competenciaName}); //filename
    const [selectedFiles, setSelectedFiles] = useState({first: null, second: null, third: null});
    const fileRefOne = useRef();
    const fileRefTwo = useRef();
    const fileRefThree = useRef();
    const [loading, setLoading] = useState(false);


    const formatterInt = new Intl.NumberFormat('en-US', {
        style: 'decimal',
        useGrouping: true,
        maximumFractionDigits: 0
      });

    const handleFormFieldChange = (e) => {
        console.log("Checking the update handle form field iwth event");
        console.log(e.target.value)
        setEditFormData((prev) => ({
            ...prev,
            [e.target.name] : e.target.value
        }))
    }

    const handleFileSelect = (event, id) => {
        const file = event.target.files[0];

        setSelectedFiles(prev => ({
            ...prev,
            [id]: file
        }))


        if(file) {
            setFileNames(prev => ({
                ...prev,
                [id]: file.name
            }))
        }

    }
    useEffect(() => {
        // setFileNames((prev) => {
        //     return {
        //         ...prev,
        //         first: content.antesName ?? '',
        //         second: content.despuesName ?? '',
        //         third: content.competenciaName ?? ''
        //     }
        // })
        // setEditFormData(prev => ({
        //     ...prev,
        //     comentario: content.comentario
        // }))
    },[content]);

    function handleEditFormSubmit(e) {
        e.preventDefault();
        console.log(e);
        console.log('Submitting the current form...');
        console.log(editFormData);

        console.log(selectedFiles)

        let imgData = {
            first: selectedFiles.first ?? '',
            second: selectedFiles.second ?? '',
            third: selectedFiles.third ?? ''
          }

          console.log('imgdata', imgData);
        //   return;

        //start loading

        setLoading(true);

        const filePromises = Object.keys(imgData).map((key) => {
            const file = selectedFiles[key];
            if (file) {
              return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => {
                  const vals = reader.result.split(',');
                  const obj = {
                    fileName: file.name,
                    mimeType: file.type,
                    data: vals[1],
                  };
                  resolve({ key, value: obj });
                };
                reader.onerror = () => {
                  reject(reader.error);
                };
                reader.readAsDataURL(file);
              });
            } else {
              return Promise.resolve({ key, value: '' });
            }
          });

          console.log('File promises!!, ', filePromises)
          Promise.allSettled(filePromises)
          .then((fileObjects) => {
              console.log(fileObjects)
              // let imgData = fileObjects.filter(result => result.status === 'fulfilled').map(item => item.value ? item.value.data : "");
              fileObjects.forEach(result => {
                  if(result.status === 'fulfilled') {
                      const { key, value } = result.value;
                      imgData[key] = value;
                  } else {
                      console.log(result.reason);
                  }
              })

              console.log('fulllfilled image data: ');
              console.log(imgData)
            //   return;


              axios.post('/api/update-data', { imgData, formData: editFormData, responseCacheKey })
              .then(response => {
                // successResponseHandler(response)
                // setSubmitLoading(false);
                // setSubmitCounter(prev => prev + 1);
                setSelectedFiles({first: null, second: null, third: null });
              console.log('success...');
              console.log(response);
              if(response.status == 'update_success') {
                setAllProducts(getSkuRanking(response.response)?.filter(item => item.completed && !item?.saved));
                console.log('Success fully update the edit cache')
                showToastMessage('update_success', content.item_sku_num)
              } else if(response.status == 'update_waiting') {
                showToastMessage('update_waiting', content.item_sku_num)
              }

              setLoading(false);
              setSelectedProduct(null);
              
              })
              .catch(error => {
                console.log(error);
                // showToastMessage('failed')
                // setLoading(false);
                // setUploading(false)
                // setSubmitLoading(false)
                // setSubmitCounter(prev => prev + 1);
                setSelectedFiles({first: null, second: null, third: null })
                setLoading(false);
              });
          })
    }

  return (
    <div className='bg-white'>
        <div className='mx-2 w-full mt-1 h-full'>
            <div className='flex flex-col justify-between h-full'>
            <div className='flex flex-row mobile-edit-modal'>
                <div className='w-[150px] p-2 sm-img-div '><img className='border border-gray-300' src={imgUrl} alt={content.item_sku_num} /></div>
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
            <div className='w-full border-b-2 border-gray-700 font-bold text-lg md:text-xl mt-2 text-gray-700'>
            </div>
            <div className='edit-product-container'>
                <form className='w-full'>
                <div className='flex flex-col md:flex-row mt-8'>
                <div className='basis-full'>
                    <div className="w-full">
                            <label className="block tracking-wide mb-2 text-lg font-bold text-[#0EA292]" htmlFor="comentarios">
                                Comentarios Adicionales
                            </label>
                            <input name='comentario' className={`appearance-none block w-10/12 md:w-11/12 bg-white text-gray-700 border rounded py-[6px] px-2 mb-3 leading-tight focus:outline-none focus:bg-white border-gray-400`} type="text" value={editFormData.comentario} onChange={handleFormFieldChange} />
                    </div>
                    <div className='w-full'>
                        <div className='text-lg font-bold text-[#0EA292] mb-4 mt-2'>Fotos Respaldo</div>
                        <div className='flex flex-row mt-4 sm-photo-upload'>
                            <div className="w-full sm:w-1/3 photo-content relative">
                                <label className="block tracking-wide text-gray-700 font-medium text-xs mb-2" htmlFor="file-upload-one">
                                    Foto Antes
                                </label>
                                <input ref={fileRefOne} className="file-input appearance-none block w-full  text-gray-700  rounded py-1 pr-2 mb-3 leading-tight focus:outline-none focus:bg-white" accept="image/*" id="file-upload-one" type="file" onChange={(e) => handleFileSelect(e, "first")} />
                                {fileNames.first && <p className='text-xs block truncate'>{fileNames.first}</p>}
                            </div>
                            <div className="w-full sm:w-1/3 photo-content relative">
                                <label className="block tracking-wide text-gray-700 font-medium text-xs mb-2" htmlFor="file-upload-two">
                                    Foto Después
                                </label>
                                <input ref={fileRefTwo} className="file-input appearance-none block w-full  text-gray-700  rounded py-1 pr-2 mb-3 leading-tight focus:outline-none focus:bg-white" accept="image/*" id="file-upload-two" type="file" onChange={(e) => handleFileSelect(e, "second")} />
                                {fileNames.second && <p className='text-xs block truncate'>{fileNames.second}</p>}
                            </div>

                            <div className="w-full sm:w-1/3 photo-content relative">
                                <label className="block tracking-wide text-gray-700 font-medium text-xs mb-2" htmlFor="file-upload-three">
                                    Foto Competencia
                                </label>
                                <input ref={fileRefThree} className="file-input appearance-none block w-full  text-gray-700  rounded py-1 pr-2 mb-3 leading-tight focus:outline-none focus:bg-white" accept="image/*" id="file-upload-three" type="file" onChange={(e) => handleFileSelect(e,"third")} />
                                {fileNames.third && <p className='text-xs block truncate'>{fileNames.third}</p>}
                            </div>
                        </div>
                    </div>
                </div>
                </div>
                <div className='edit-product-footer mt-4 flex flex-row justify-between mb-2'>
                    <button type='button' className=' bg-slate-700 text-white px-4 py-1 cursor-pointer' onClick={() => setSelectedProduct(null)}>Volver atrás</button>
                <div className='btn-group'>
                    <button type='button' className=' bg-[#175B6A] text-white px-3 py-1 mr-4 cursor-pointer' onClick={() => setSelectedProduct(null)}>Cancelar</button>
                    <button type='submit' className=' bg-[#175B6A] text-white px-3 py-1 cursor-pointer' onClick={handleEditFormSubmit}>Confirmar</button>
                </div>
            </div>
                </form>
            </div>

            </div>
        </div>
        {
                loading && (
                    <div className="loading-overlay">
                        <div className="loading-spinner"></div>
                    </div>
                )
            }
    </div>
  )
}

export default EditProduct