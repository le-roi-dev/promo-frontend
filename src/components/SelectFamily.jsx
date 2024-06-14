import React, { useState, useEffect, useRef} from 'react'

const SelectFamily = ({ familyName, selectFamily, storeValue, currentFamilyName, setCurrentFamilyName, submitCounter }) => {
    const [options, setOptions] = useState([]);
    const [selectedFamily, setSelectedFamily] = useState("")

    let defaultRef = useRef(null);

    useEffect(() => {
        if(familyName && typeof familyName === 'object' && familyName?.length) {
            setOptions(familyName)
        } else {
            setOptions([])
        }
    },[familyName])


    const handleOptionChange = (e) => {
        setSelectedFamily(e.target.value)
        selectFamily(e.target.value)
        setCurrentFamilyName(e.target.value)
    }

useEffect(() => {
  setSelectedFamily("");
  selectFamily("");
  console.log('Store value change?');
},[storeValue])

useEffect(() => {
  console.log('Change in current family...');
  setSelectedFamily(currentFamilyName);
},[currentFamilyName, submitCounter])
  
    return (
      <div className="relative">
        <select value={selectedFamily} className="block group-hover:block block appearance-none w-full border bg-white text-gray-700 text-black py-1 px-2 mb-3 rounded leading-tight focus:outline-none focus:bg-white focus:text-black focus:border-gray-500 cursor-pointer input-text-container min-w-[230px] border-gray-400" onChange={handleOptionChange} >
          <option value="">Seleccionar Familia...</option>
          {options.map((option, index) => (
            <option key={index} value={option.family}>
              {option.family}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg className="fill-current h-4 w-4 mb-2 ml-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
        </div>
      </div>
    );
}

export default SelectFamily