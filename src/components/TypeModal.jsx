import React, { useState, useEffect} from 'react'

const TypeModal = ({setResponseType, setOpen }) => {
    const [selectedOption, setSelectedOption] = useState("sku"); // initial option is "sku"

    const handleOptionChange = (event) => {
      setSelectedOption(event.target.value);
    };
  
    const handleSubmit = (event) => {
      event.preventDefault();
      console.log("Option selected: ", selectedOption);
      setResponseType(selectedOption);
      setOpen(false)
    };
  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center">
    <div className="fixed top-0 left-0 w-full h-full bg-black opacity-50 overlay"></div>
    <div className="bg-white modal border border-gray-500 inline-block align-bottom rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full mobile-modal">
          <div className="bg-white px-2 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start sm:justify-start">
              {/* Radio options */}
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <div className="mt-2 flex mb-3">
                  <input
                    type="radio"
                    name="option"
                    id="option1"
                    value="sku"
                    checked={selectedOption === "sku"}
                    onChange={handleOptionChange}
                    className="form-radio-custom"
                  />
                  <label
                    htmlFor="option1"
                    className="ml-3 text-sm leading-5 font-medium text-gray-700 cursor-pointer text-left"
                  >
                    Realizar la gestión de todas las alertas
                  </label>
                </div>
                <div className="mt-2 flex">
                  <input
                    type="radio"
                    name="option"
                    id="option2"
                    value="familia"
                    checked={selectedOption === "familia"}
                    onChange={handleOptionChange}
                    className="form-radio-custom"
                  />
                  <label
                    htmlFor="option2"
                    className="ml-3 text-sm leading-5 font-medium text-gray-700 cursor-pointer text-left"
                  >
                    Realizar la gestión en orden familia
                  </label>
                </div>
              </div>
            </div>
          </div>
          {/* Confirm button */}
          <div className="px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse justify-center">
            <span className="flex w-full rounded-md shadow-sm sm:ml-3 sm:w-auto">
              <button
                type="button"
                onClick={handleSubmit}
                className="inline-flex justify-center w-full rounded-md border border-transparent px-4 py-2 bg-[#0EA292] text-base leading-6 font-medium text-white shadow-sm hover:bg-[#0b897d] focus:outline-none focus:bg-[#0b897d] focus:shadow-outline-indigo active:bg-[#0b897d] transition duration-150 ease-in-out"
              >
                Confirmar
              </button>
            </span>
          </div>
    </div>
    </div>
  )
}

export default TypeModal