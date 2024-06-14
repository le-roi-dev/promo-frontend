import React, { useEffect, useState } from 'react'
import { Header } from './components/Header';
import { FormBody } from './components/FormBody';
import { LoadingSpinner } from './components/LoadingSpinner';
import TypeModal from './components/TypeModal';
import './index.scss'
import axios from './connection/axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import CountrySelect from './components/CountrySelect';


function HomePage({ userData, onLogoutClick }) {
  const [stores, setStores] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [responseType, setResponseType] = useState("");
  const [open, setOpen] = useState(true);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [countries, setCountries] = useState([]);

  const handleStateChange = newState => {
    setSelectedCountry(newState);
  };
  useEffect(() => {
    console.log('state: ', selectedCountry);
  }, [selectedCountry])
  useEffect(() => {

  }, [open])

  const getCountries = (data) => {
    let unique_data = new Set();
    data.forEach(item => unique_data.add(item.country_id));

    return Array.from(unique_data.values());
  }

  const getSelectedStores = () => {
    let data = stores.filter(item => item.country_id === selectedCountry).sort((a, b) => a.location_id - b.location_id);
    return data.length ? data : [];
  }

  useEffect(() => {
    axios.get('api/storelocationdata')
      .then(data => {
        console.log(data)
        setStores(data)

      }).catch((err) => {
        console.log("Error while loading store data from google spreadsheet.");
      })
    console.log('hello')
  }, [])

  useEffect(() => {
    const countrySet = new Set();
    if (stores.length) {
      console.log('stores,: ', stores);
      stores.forEach(item => countrySet.add(item["country_id"]));
      setCountries(...countrySet.values());
      console.log('countrrr: ', countrySet)
    }
  }, [stores])

  useEffect(() => {
    console.log('countries,', countries)
  }, [countries])


  return (
    <div className='main-body bg-gray-200 relative h-screen'>
      <div className='max-w-screen-xl md:mx-auto main_body mb-6' style={{ marginBottom: '0px', paddingTop: '0px', paddingBottom: '0px' }}>
        <div className={`relative bg-white w-full h-screen mb-[100px] md:mb-[200px] pt-[15px] md:w-max-[1200px] container_body ${isLoading ? 'hidden' : 'block'}`} >
          <button className='absolute right-4 top-0' onClick={onLogoutClick}>
            <FontAwesomeIcon icon={faSignOutAlt} />
            <span className='ml-1 underline'>Cerrar sesión</span>
          </button>
          <Header />
          <CountrySelect options={getCountries(stores)} onOptionChange={handleStateChange} />
          <FormBody responseType={responseType} currentCountry={selectedCountry} storeOptions={getSelectedStores()} userData={userData} onLogoutClick={onLogoutClick} />
          {open && <TypeModal setOpen={setOpen} setResponseType={setResponseType} />}
        </div>
        {isLoading && <LoadingSpinner isLoading={isLoading} />}
      </div>
    </div>
  )
}

export default HomePage
