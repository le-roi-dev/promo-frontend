import React, { useState } from 'react';
import { useEffect } from 'react';

const CheckboxGroup = ({ handleCheckboxSelection, selectedOptions, setSelectedOptions, setPhotoRequired, submitCounter, setFormData, formData }) => {
  const options = [
    "Sin stock a la mano del cliente (altillo/reposición por tasa de venta)",
    "Sin stock por quiebre del producto",
    "Kardex descuadrado (daño, hurto o incompleto)",
    "Precio más alto que en la competencia",
    // "Existe alternativa a mejor precio dentro de la tienda",
    "Hay un producto similar pero de otro conjunto, a mejor precio en la tienda",
    "Falta fleje o cartel de precio",
    "Empaque del producto no ayuda al autoservicio y/o no tiene ficha técnica",
    "Producto no tiene exhibición, esta dañada o incompleta",
    "Están las condiciones de venta, hay posible efecto de mercado",
    "Factor de Venta Empresa con stock desde tienda",
    "Otros",
  ];

  const handleCheckboxChange = (e) => {
    console.log('it should be called unless i checked it')
    const selectedOption = e.target.value;
    if (selectedOptions.includes(selectedOption)) {
      let newOptions = selectedOptions.filter((option) => option !== selectedOption);
      console.log(newOptions)
      setSelectedOptions(newOptions);
      if(selectedOption == "Otros") {
        setFormData((prev) => {
          return {
            ...prev,
            action_detail: ""
          }
        })
      }
    } else {
      if(selectedOptions && selectedOptions.length == 2) {
        return;
      }
      setSelectedOptions([...selectedOptions, selectedOption]);
    }
  };


  useEffect(() => {
    handleCheckboxSelection(selectedOptions);
    if(selectedOptions.includes("Precio más alto que en la competencia")) {
      setPhotoRequired(true);
    } else {
      setPhotoRequired(false);
    }
  },[selectedOptions])


  useEffect(() => {
    console.log("form data action detail added")
    console.log(formData.action_detail)
  },[formData.action_detail])

  return (
    <div className="flex flex-col">
      {options.map((option) => (
        <label key={option} className={`block text-gray-700 font-normal my-1 cursor-pointer ${option == "Otros" ? 'relative' : ''}`}>
          <input
            type="checkbox"
            value={option}
            onChange={handleCheckboxChange}
            checked={selectedOptions.includes(option)}
            className="mr-2 leading-tight"
          />
          {option}
          {selectedOptions.includes("Otros") && option == "Otros" &&
          <input name='other' className={`absolute top-0 -mt-[2px] left-[80px] block w-7/12 bg-white text-gray-700 border rounded py-[6px] px-2 mb-3 leading-tight focus:outline-none focus:bg-white border-gray-400`} type="text" value={formData.action_detail} onChange={(e) => setFormData(prev => ({...prev, action_detail: e.target.value}))} placeholder="Detallar" />
          }
        </label>
      ))}

    </div>
  );
};

export default CheckboxGroup;