import { useState, useEffect } from 'react';

import { debounce } from 'lodash';
import { showToastMessage } from '../FormBody';
import axios from '../../connection/axios'

const useProductData = (storeValue, currentCountry, onLogoutClick) => {
  const [apiLoading, setApiLoading] = useState(false);
  const [apiResponse, setApiResponse] = useState(null);

  useEffect(() => {
    if(storeValue) {
      async function getProductData() {
        setApiLoading(true);
        try {
          const response = await axios.get('/api/alert-data?store_id='+storeValue+'&country_id='+currentCountry);
          // if no data found for a store
          if(response) {
            console.log('response:::::: ' , response);
            if(!response.response) {
              showToastMessage('not found');
            } else {
              setApiResponse(response);
            }
          } else {
            showToastMessage('server error');
          }
        } catch (error) {
          console.error('Error fetching product data:', error); 
          // handle error here, e.g. show an error message to the user
          // showToastMessage('server error'); 
          // here i should redirect the user back to login page
          // i don't have any separate route for login page, but based on the user's successfull authentication in google, i can get the session data and store that info in object, and based on the object, i show login component or homepage component,
          //console.log('log out the user!');
          // onLogoutClick(); i need to call this function only when the server give me 401 unauthorized error
          if (error.response && error.response.status === 401) {
            console.log('Unauthorized error. Logging out the user!');
            onLogoutClick(); // Call the logout function when the response status is 401
            // Additional logic for redirecting the user or showing login component
          } else {
            showToastMessage('Server error'); // Show a generic error message
          }
        } finally {
          setApiLoading(false); 
        }
      }
      const debounceFetchedResult = debounce(getProductData, 50);
      debounceFetchedResult();
    } 
    console.log('Store value changed.. waiting for api call');
  }, [storeValue]);

  return { apiLoading, apiResponse};
};

export default useProductData;