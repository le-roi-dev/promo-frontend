import React, { useEffect, useState, useRef } from 'react'
import CheckboxGroup from './Checkbox'
import { initialFormData } from './FormBody';

const UserResponse = ({ formData, setFormData, handleFormFieldChange, errorField, setSelectedFiles, submitCounter, savedCheckbox, fileNames, setFileNames}) => {
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [oneTimeRender, setOneTimeRender] = useState(true);
    const [photoRequired, setPhotoRequired] = useState(formData?.action_taken?.includes("Precio más alto que en la competencia"));



    const isRadioButtonSelected = (value) => formData.alert === value;
    // checkbox select handle
    const fileRefOne = useRef();
    const fileRefTwo = useRef();
    const fileRefThree = useRef();
    const resetFile = () => fileRef.current.value = "";
    function handleCheckboxSelection(data) {
        console.log('handle checkbox change triggeredd');
        console.log('with data:');
        console.log(data)
        setFormData((prev) => {
            return {
                ...prev,
                action_taken: data
            }
        })

        console.log('action taken text:   ' + data)
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

    },[selectedOptions])

    useEffect(() => {

    // setFormData(initialFormData);
        console.log('Submittin and resetting default form data');
        setFileNames({first: null, second: null, third: null});
        setSelectedOptions([]);
        setPhotoRequired(false);
        fileRefOne.current.value = "";
        fileRefTwo.current.value = "";
        if(fileRefThree?.current && fileRefThree?.current?.value) {
            fileRefThree.current.value = "";
        }
        isRadioButtonSelected(-1);

    },[submitCounter])

    useEffect(() => {
        console.log('re rendering saved checkbox...')
        console.log(savedCheckbox)
        setSelectedOptions(savedCheckbox);
    },[savedCheckbox])


    useEffect(() => {
        if(formData.antesName) {
            setFileNames(prev => ({...prev, first: formData.antesName}))
        }
        if(formData.despuesName) {
            setFileNames(prev => ({...prev, second: formData.despuesName}))
        }
        if(formData.competenciaName) {
            setFileNames(prev => ({...prev, third: formData.competenciaName}))
        }
    },[formData])

    // useEffect(() => {
    //     console.log('file name updated')
    // },[fileNames])

  return (
        <div className='w-full'>
        <div className='w-full border-b-2 pb-2 border-gray-700 font-bold text-lg md:text-xl mb-2 mt-6 mb-5 text-gray-700'>
            Feedback Alerta
        </div>
        <div className='flex flex-col md:flex-row mt-8'>
                <div className='basis-full md:basis-1/2 md:min-w-[50%] mr-6 mb-5'>
                <div className='text-lg font-bold text-[#0EA292] mb-2'>Motivo/Acción<span className='text-red-500 font-bold text-lg ml-1'>*</span></div>
                    <div className="w-full sm:w-full px-1">
                    <label className="block tracking-wide text-gray-700 font-medium text-xs mb-2" htmlFor="grid-first-name">
                        Máximo 2 alternativas
                    </label>
                    <CheckboxGroup selectedOptions={selectedOptions} setSelectedOptions={setSelectedOptions} handleCheckboxSelection={handleCheckboxSelection} setPhotoRequired={setPhotoRequired} submitCounter={submitCounter} savedSelected={formData.action_taken} setFormData={setFormData} formData={formData} />
                    </div>
                </div>
                <div className='basis-full md:basis-1/2'>
                    <div className="w-full">
                            <label className="block tracking-wide mb-2 text-lg font-bold text-[#0EA292] mb-2" htmlFor="comentarios">
                                Comentarios Adicionales
                            </label>
                            <input name='comentario' className={`appearance-none block w-10/12 md:w-11/12 bg-white text-gray-700 ${errorField.comment ? 'border border-red-600' : 'border'} rounded py-[6px] px-2 mb-3 leading-tight focus:outline-none focus:bg-white border-gray-400`} type="text" value={formData.comentario} onChange={handleFormFieldChange} />
                    </div>
                    <div className='w-full'>
                        <div className='text-lg font-bold text-[#0EA292] mb-4 mt-2'>Fotos Respaldo<span className='text-red-500 font-bold text-lg ml-1'>*</span></div>
                        <div className='flex flex-row mt-4 mobile-responsive-parts'>
                            <div className="w-full sm:w-1/3 photo-content relative">
                                <label className="block tracking-wide text-gray-700 font-medium text-xs mb-2" htmlFor="file-upload-one">
                                    Foto Antes <span className='text-red-500'>*</span>
                                </label>
                                <input ref={fileRefOne} className="file-input appearance-none block w-full  text-gray-700  rounded py-1 pr-2 mb-3 leading-tight focus:outline-none focus:bg-white" accept="image/*" id="file-upload-one" type="file" onChange={(e) => handleFileSelect(e, "first")} required />
                                {fileNames.first && <p className='text-xs block truncate'>{fileNames.first}</p>}
                            </div>
                            <div className="w-full sm:w-1/3 photo-content relative">
                                <label className="block tracking-wide text-gray-700 font-medium text-xs mb-2" htmlFor="file-upload-two">
                                    Foto Después
                                </label>
                                <input ref={fileRefTwo} className="file-input appearance-none block w-full  text-gray-700  rounded py-1 pr-2 mb-3 leading-tight focus:outline-none focus:bg-white" accept="image/*" id="file-upload-two" type="file" onChange={(e) => handleFileSelect(e, "second")} />
                                {fileNames.second && <p className='text-xs block truncate'>{fileNames.second}</p>}
                            </div>
                                {photoRequired && (
                                    <div className="w-full sm:w-1/3 photo-content relative">
                                        <label className="block tracking-wide text-gray-700 font-medium text-xs mb-2" htmlFor="file-upload-three">
                                            Foto Competencia {photoRequired && <span className='text-red-500'>*</span>}
                                        </label>
                                        <input ref={fileRefThree} className="file-input appearance-none block w-full  text-gray-700  rounded py-1 pr-2 mb-3 leading-tight focus:outline-none focus:bg-white" accept="image/*" id="file-upload-three" type="file" onChange={(e) => handleFileSelect(e,"third")} required={photoRequired} />
                                        {fileNames.third && <p className='text-xs block truncate'>{fileNames.third}</p>}
                                    </div>
                                )}
                        </div>
                        {/* <div className='w-full text-right text-gray-600 mt-2  pl-[20%] md:pl-[30%]'>* Foto competencia obligatoria si es que dice que competencia está a mejor precio</div> */}
                    </div>
                    <div className="w-full">
                        <div className='text-lg font-bold text-[#0EA292] my-2 mt-3'>Utilidad Alerta<span className='text-red-500 font-bold text-lg ml-1'>*</span></div>
                        <div className="flex flex-row">
                            <div className="flex justify-start flex-col mr-8">
                                <label className="thumbsUp-label cursor-pointer">
                                <input type="radio" checked={isRadioButtonSelected('1')} name="alert" className="thumbsUp-radio" value="1" onChange={handleFormFieldChange} defaultValue={formData.alert} />
                                <span className="thumbsUp"></span>
                                <span className='block text-gray-600'>Si fue útil</span>
                                </label>
                            </div>
                            <div className="flex justify-start flex-col">
                                <label className="thumbsDown-label cursor-pointer">
                                <input type="radio" checked={isRadioButtonSelected('0')} name="alert" className="thumbsDown-radio" value="0" onChange={handleFormFieldChange} defaultValue={formData.alert} />
                                <span className="thumbsDown"></span>
                                <span className='block text-gray-600 -mt-[7px]'>No fue útil</span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
                


        </div>

    </div>
  )
}

export default UserResponse