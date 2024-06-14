import React, { useState, useEffect} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import getAllCompleteInputState from './utils/getAllCompleteInputState';
const ConfirmSaveModal = ({setResponseType, setOpenSaveModal, formData, selectedFiles, handleSaveCallback }) => {
  const [selectedOption, setSelectedOption] = useState(""); // initial option is "sku"

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

    let missingFields = getAllCompleteInputState(formData, selectedFiles);
    console.log("missing fields", missingFields);
  
    const handleConfirm = () => {
      if(selectedOption === "confirm_save") {
        handleSaveCallback();
      }
      setOpenSaveModal(false);
      console.log('selected opoijtns');
      console.log(selectedOption)
      console.log('okay!!!')
    };
  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center">
    <div className="fixed top-0 left-0 w-full h-full bg-black opacity-50 overlay"></div>
    <div className="bg-white modal border border-gray-500 inline-block align-bottom rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full relative">
    <div className='absolute right-1 top-1'><button onClick={() => setOpenSaveModal(false)}><FontAwesomeIcon icon={faTimes} size={'1x'} height={28} width={28} /></button></div>
          <div className="bg-white px-2 pt-5 pb-4 sm:pb-4">
            <div className="sm:flex sm:items-start sm:justify-start">
              {/* Radio options */}
              <div className="mt-3">
                <div className="mt-2 flex mb-3">
                  <input
                    id="option1"
                    type="radio"
                    name="firstCheck"
                    value="confirm_save"
                    checked={selectedOption === "confirm_save"}
                    onChange={handleOptionChange}
                    className="mr-2 leading-tight"
                  />
                  <label
                    htmlFor="option1"
                    className="ml-3 text-sm leading-5 font-medium text-gray-700 cursor-pointer"
                  >
                    ¿Está seguro que desea finalizar sin guardar los cambios de este último producto?
                  </label>
                </div>
                <div className="mt-2 flex flex-col">
                    <div className='input-main w-full'>
                        <input
                        id="option2"
                        type="radio"
                        name="secondCheck"
                        value="required_missing"
                        checked={selectedOption === "required_missing"}
                        onChange={handleOptionChange}
                        className="mr-2 leading-tight"
                    />
                    <label
                        htmlFor="option2"
                        className="ml-3 text-sm leading-5 font-medium text-gray-700 cursor-pointer"
                    >
                        Continuar revisión. Faltan rellenar los siguientes campos : 
                    </label>
                    </div>
                    <div className='items w-full ml-[25px] text-left'>
                        {missingFields.map((item, index) => {
                            return <li className='text-sm leading-5 font-light text-gray-700  list-none' key={index}>{' - '}{item}</li>
                        })}
                    </div>
                </div>
              </div>
            </div>
          </div>
          {/* Confirm button */}
          <div className="px-4 py-3 sm:px-6 flex justify-end">
            <span className="flex w-full rounded-md shadow-sm sm:ml-3 sm:w-auto">
              <button
                type="button"
                onClick={() => handleConfirm()}
                className="w-full rounded-md border border-transparent px-4 py-2 bg-[#175B6A] text-base leading-6 font-medium text-white shadow-sm hover:bg-[#1b6c7e] focus:outline-none focus:bg-[#175B6A] focus:shadow-outline-indigo active:bg-[#175B6A] transition duration-150 ease-in-out"
                disabled={selectedOption.secondCheck === false}
              >
                Confirmar
              </button>
            </span>
          </div>
    </div>
    </div>
  )
}

export default ConfirmSaveModal