import React, { useState, useEffect} from 'react'
import AnsweredItem from './AnsweredItem';
import { getSkuRanking } from './utils/updateAllState';
import EditProduct from './EditProduct';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';


const EditModal = ({ setShowEditModal, products, responseCacheKey, setAllProducts }) => {
    const [answeredProducts, setAnsweredProducts] = useState([]);
    const [selectedOption, setSelectedOption] = useState("sku"); // initial option is "sku"
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [filterText, setFilterText] = useState('');

    const handleOptionChange = (event) => {
      // setSelectedOption(event.target.value);
    };
  
    const handleSubmit = (event) => {
      event.preventDefault();
      // console.log("Option selected: ", selectedOption);
      // setResponseType(selectedOption);
      // setOpen(false)
      setShowEditModal(false);
    };

    useEffect(() => {
      if(products && products.length) {
        const completedProduct = products?.filter(product => product.completed === true);
        console.log('completedProduct');
        setAnsweredProducts(completedProduct)
      }
      console.log('products', products)
    },[products])

    useEffect(() => {
      setFilterText('');
    },[selectedProduct])

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center">
    <div className="fixed top-0 left-0 w-full h-full bg-black opacity-50 overlay"></div>
    <div className="bg-white modal edit-modal sm-edit-modal border border-gray-500 inline-block align-bottom rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle max-w-[800px] sm:w-full z-50 relative">
          <div className='absolute right-1 top-1'><button onClick={() => setShowEditModal(false)}><FontAwesomeIcon icon={faTimes} size={'2x'} /></button></div>
          <div className='modal-header block bg-[#175B6A] text-white px-2 py-2 w-[230px]'>Seleccionar sku a Modificar</div>
          <div className="bg-white px-2 pt-5 pb-4 sm:p-2 sm:pb-4 edit-modal-inside">
          {!selectedProduct && (<div className='flex justify-center w-full mt-2'>
              <input className='appearance-none block w-8/12 md:w-11/12 bg-white text-gray-700 border rounded py-[6px] px-2 mb-3 leading-tight focus:outline-none focus:bg-white border-gray-400' placeholder='SKU' onChange={(e) => setFilterText(e.target.value)} />
            </div>)}
            <div className={`ml-4 mb-2 ${selectedProduct ? 'hidden' : 'block'}`}>SKUs de semana en curso con respuestas </div>
            <div className="sm:flex sm:items-start sm:justify-start flex-col relative">
              {/* Radio options */}
              <div className={`${!selectedProduct ? 'block' : 'hidden'}  h-96 w-full p-2 border overflow-x-hidden m-4 sm-scroll-block`}  style={{overflowY: 'scroll'}}>
                {answeredProducts.filter(product => product.item_sku_num.includes(filterText)).map((item) => {
                  return <AnsweredItem content={item} key={item.item_sku_num} setSelectedProduct={setSelectedProduct} />
                })}
              </div>
              {selectedProduct && <EditProduct content={selectedProduct} setSelectedProduct={setSelectedProduct} setAllProducts={setAllProducts} responseCacheKey={responseCacheKey} />}
            </div>
          </div>
          {/* Confirm button */}
          {/* <div className="px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse justify-center">
            <span className="flex w-full rounded-md shadow-sm sm:ml-3 sm:w-auto">
              <button
                type="button"
                onClick={handleSubmit}
                className="inline-flex justify-center w-full rounded-md border border-transparent px-4 py-2 bg-[#0EA292] text-base leading-6 font-medium text-white shadow-sm hover:bg-[#0b897d] focus:outline-none focus:bg-[#0b897d] focus:shadow-outline-indigo active:bg-[#0b897d] transition duration-150 ease-in-out"
              >
                Confirmar
              </button>
            </span>
          </div> */}
    </div>
    </div>
  )
}

export default EditModal