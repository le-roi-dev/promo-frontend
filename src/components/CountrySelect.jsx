import React, { useState } from 'react'

const CountrySelect = ({options, onOptionChange}) => {
    const [selectedOption, setSelectedOption] = useState(options[0]);
    const handleOptionChange = event => {
        setSelectedOption(event.target.value);
        onOptionChange(event.target.value);
      };

  return (
    <div className='w-full mt-4 px-6 md:px-14 bg-white'>
        <div className="flex flex-row items-center justify-start mr-8">
            <label className="block tracking-wide text-gray-700 mb-3 w-[95px] pr-10" htmlFor="family-name">
                País:
            </label>
            <div className="relative">
                <select name='store' className={`group-hover:block block appearance-none w-full min-w-[200px] md:min-w-[230px] border bg-white text-gray-700 py-1 px-2 mb-3 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500 cursor-pointer border-gray-400`} id="grid-state"
                value={selectedOption}
                onChange={handleOptionChange}>
                <option className='hover:text-gray-700  bg-gray-50 hover:bg-gray-100 py-2 px-4 block whitespace-no-wrap hover:cursor-pointer' value={''}>Elegir tienda...</option>
                {options.map(option => (
                    <option className='hover:text-gray-700  bg-gray-50 hover:bg-gray-100 py-2 px-4 block whitespace-no-wrap hover:cursor-pointer' key={option} value={option}>{option}</option>
                    
                ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 mb-2 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
            </div>
        </div>
    </div>
  )
}

export default CountrySelect