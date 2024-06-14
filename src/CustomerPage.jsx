import React, { useEffect, useCallback, useState } from 'react'
import { Header } from './components/Header';
import { FormBody } from './components/FormBody';
import { LoadingSpinner } from './components/LoadingSpinner';
import TypeModal from './components/TypeModal';
import './index.scss'
import axios from './connection/axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import CountrySelect from './components/CountrySelect';
import siteLogo from './assets/site_logo.png'

function CustomerPage() {
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [storeValue, setStoreValue] = useState("");

  useEffect(() => {
    axios.get('api/client-data')
      .then(data => {
        setClients(data.response.data)

      }).catch((err) => {
        console.log("Error while loading store data from google spreadsheet.");
      })
  }, [])

  useEffect(() => {
    const client = clients.find(c => c.rut.includes(searchText));
    if (client && searchText.length > 0) {
      setSelectedClient(client);
      console.log(client)
    }
  }, [searchText])

  const onLogoutClick = useCallback(async () => {
    try {
      const response = await fetch('/api/logout', { credentials: 'include' });
      if (response.ok) {
        setUser(null);
      }
    } catch (error) {
      console.error('Error logging out:', error);
    }
  }, []);

  const handleStoreSelect = (e) => {
    setStoreValue(e.target.value);
  }

  const onSubmit = () => {
    setIsLoading(true)
    if (selectedClient) {
      axios.post('/api/save-client', { rut: selectedClient?.rut, rubro: selectedClient?.rubro, option: storeValue })
    }
    setIsLoading(false)
  }

  return (
    <div className='main-body bg-gray-200 relative h-screen'>
      <div className='max-w-screen-xl md:mx-auto main_body mb-6' style={{ marginBottom: '0px', paddingTop: '0px', paddingBottom: '0px' }}>
        <div className={`relative bg-white w-full h-min-screen mb-[100px] md:mb-[200px] pt-[15px] md:w-max-[1200px] container_body ${isLoading ? 'hidden' : 'block'}`} >
          <button className='absolute right-4 top-0' onClick={onLogoutClick}>
            <FontAwesomeIcon icon={faSignOutAlt} />
            <span className='ml-1 underline'>Cerrar sesión</span>
          </button>
          <>
            <div className="bg-blue-500 bg-gradient-to-r from-blue-600 to-blue-400 rounded-tr-lg rounded-br-lg shadow-2xl text-white text-left py-3 px-2 md:px-4 header mt-4 mx-[10px] md:mx-[15px]">
              <div className="flex items-center justify-between mx-2 md:mx-[24px]">
                <div className='text-section text-white pr-2'>
                  <h2 className='font-bold md:text-lg text-sm'>Herramienta Cartera Clientes CES</h2>
                  <p className='font-light text-[12px] md:text-sm'>Realizado por Business Analytics - BI Chile</p>
                </div>
                <img className='pb-[5px] md:pb-[10px] max-w-[150px] md:max-w-[150px]' src={siteLogo} width={200} height={40} />
              </div>
            </div>
          </>
          <div className='w-full mt-4 px-6 md:px-14 bg-white'>
            <div className="flex flex-row items-center">
              <div className='font-bold flex-1 text-xl'>Datos Cliente</div>
              <div className='flex items-center'><div>Buscar Cliente</div> <input type="text" onChange={e => setSearchText(e.target.value)} className='appearance-none block w-10/12 md:w-11/12 bg-white text-gray-700 border rounded py-[6px] px-2 leading-tight focus:outline-none focus:bg-white border-gray-400 ml-6' /></div>
            </div>
            <div className="border p-4 mt-4">
              <div className='flex flex-row items-center mb-3'>
                <div className='flex-1'>
                  <div className="font-semibold tracking-wide">
                    Nombre Cliente
                  </div>
                  <div>{selectedClient?.nombre_empresa}</div>
                </div>
                <div className='flex-1'>
                  <div className="font-semibold tracking-wide">
                    Fecha de inscripcion
                  </div>
                  <div>{selectedClient?.fecha_inscripcion_ces}</div>
                </div>
              </div>
              <div className='flex flex-row items-center mb-3'>
                <div className='flex-1'>
                  <div className="font-semibold tracking-wide">
                    Rut Cliente
                  </div>
                  <div>{selectedClient?.rut}</div>
                </div>
                <div className='flex-1 flex'>
                  <label className="block tracking-wide mb-2 mb-2" htmlFor="number">
                    Rubro
                  </label>
                  <input name='number' className={`ml-4 appearance-none block w-10/12 md:w-11/12 bg-white text-gray-700 border rounded py-[6px] px-2 mb-3 leading-tight focus:outline-none focus:bg-white border-gray-400`} type="text" value={selectedClient?.rubro} />
                </div>
              </div>
              <div className='flex flex-row items-center mb-3'>
                <div className='flex-1'>
                  <div className="font-semibold tracking-wide">
                    Categoria de Cliente
                  </div>
                  <div>{selectedClient?.marca_piramide}</div>
                </div>
                <div className='flex-1'>
                  <div className="font-semibold tracking-wide">
                    Tienda Asignada
                  </div>
                  <div>{selectedClient?.cc}</div>
                </div>
              </div>
              <div className='flex flex-row items-center mb-3'>
                <div className='flex-1'>
                  <div className="font-semibold tracking-wide">
                    Estado CES
                  </div>
                  <div></div>
                </div>
                <div className='flex-1'>
                  <div className="font-semibold tracking-wide">
                    Vendedor Asignado
                  </div>
                  <div>{selectedClient?.ejecutivo}</div>
                </div>
              </div>
            </div>
          </div>
          <div className='w-full my-4 px-6 md:px-14 bg-white'>
            <div className="flex flex-row items-center justify-start mr-8">
              <label className="block tracking-wide text-gray-700 mb-3 w-[95px] pr-10" htmlFor="family-name">
                Opciones:
              </label>
              <div className="relative">
                <select name='store' className={`group-hover:block block appearance-none w-full min-w-[200px] md:min-w-[230px] border bg-white text-gray-700 py-1 px-2 mb-3 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500 cursor-pointer border-gray-400`} id="grid-state"
                  onChange={handleStoreSelect}>
                  <option className='hover:text-gray-700  bg-gray-50 hover:bg-gray-100 py-2 px-4 block whitespace-no-wrap hover:cursor-pointer' value={''}>seleccionar opción...</option>
                  <option value="Eliminar Cartera">Eliminar Cartera</option>
                  <option value="Ingresar a la Cartera">Ingresar a la Cartera</option>
                  <option value="No se pueden realizar acciones">No se pueden realizar acciones</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 mb-2 text-gray-700">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                </div>
              </div>
            </div>
          </div>
          <div className='w-full flex justify-end'>
            <button className='p-4 border rounded m-6 bg-[rgba(1,180,201,1)] text-white' onClick={onSubmit}>Enviar</button>
          </div>
        </div>
        {isLoading && <LoadingSpinner isLoading={isLoading} />}
      </div>
    </div>
  )
}

export default CustomerPage
