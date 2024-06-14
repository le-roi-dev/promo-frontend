import React, { useEffect, useRef, useState } from 'react'
import { ProductContent } from './ProductContent'

import toast, { Toaster } from 'react-hot-toast';

import UserResponse from './UserResponse';

import SelectFamily from './SelectFamily';


import useProductData from './utils/useProductData';
import updateAllState from './utils/updateAllState';
import getStoreName from './utils/getStoreName';

import axios from '../connection/axios';
import EditModal from './EditModal';
import { getSkuRanking } from './utils/updateAllState';
import ConfirmSaveModal from './ConfirmSaveModal';
import getAllCompleteInputState from './utils/getAllCompleteInputState';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faChevronCircleLeft, faChevronLeft } from '@fortawesome/free-solid-svg-icons';

export const initialFormData = {
    tienda: "",
    item_sku_num: '', 
    product_name: '',
    action_taken: [],
    action_detail: '',
    alert: '',
    fecha_alerta: '',
    comentario: '',
    departamento: '', // set on sku load
    familia: '', // set on sku load
    subfamilia: '', // set on sku load
    grupo: '',
    conjunto: '',
    venta_potencial: '', // set on sku load
    venta_esperada: '', // set on sku load
    venta_total: '', // set on sku load
    antesName: "",
    antesUrl: "",
    despuesUrl: "",
    despuesName: "",
    competenciaUrl: "",
    competenciaName: "",
    numero_alerta: null,
    country_id: "",
    location_id: null,
};


export const initialErrorField = {
    item_sku_num: false,
    product_name: false,
    alert: false,
    comentario: false
}

export const showToastMessage = (value, extraMessage="") => {
    if(value === 'success') { //success
        toast.success('Formulario enviado con éxito. ', {
            duration: 4000,
            position: 'top-right'
        });
    } 
    else if(value === 'error') { // input field is required
        toast.error('Por favor, introduzca todos los campos.', {
            duration: 4000,
            position: 'top-right'
        });
    } 
    else if(value === 'not found') { // data not found for the store
        toast.error('Lo sentimos, no se han encontrado datos de alerta.', {
            duration: 4000,
            position: 'top-right'
        });
    } 
    else if(value === 'server error') { // input field is required
        toast.error('No hay datos de alerta o No se han podido obtener datos del servidor.', {
            duration: 4000,
            position: 'top-right'
        });
    } 
    else if(value === 'already_submitted') { // input field is required
        toast.error('Esta alerta ya ha sido enviada.', {
            duration: 4000,
            position: 'top-right'
        });
    } 
    else if(value === 'completed') { // input field is required
        toast.success('Se ha informado todas las respuestas de alerta.', {
            duration: 2500,
            position: 'top-right',
            className: 'custom_completedClass',
            style: {
                padding: '20px 30px',
                background: "rgb(211, 251, 230)",
                color: '#282e0e',
            }
        });
    }
    else if(value === 'No alert') { // input field is required
        toast.success('No hay más alertas', {
            duration: 2500,
            position: 'top-right',
            className: 'custom_completedClass',
            style: {
                padding: '20px 30px',
                background: "rgb(211, 251, 230)",
                color: '#282e0e',
            }
        });
    }
    else if(value === 'incomplete notice') { // input field is required
        toast.success(`Formulario no completado anteriormente, por favor responder todas las opciones : \n${extraMessage}`, {
            duration: 2500,
            position: 'top-right',
            className: 'custom_completedClass',
            style: {
                padding: '20px 30px',
                background: "rgb(240, 233, 221)",
                color: '#282e0e',
            }
        });
    } else if(value === 'update_waiting') { // update alert recored should be waited for sometime
        toast.error(`Usted debe esperar algún tiempo para actualizar la alerta en la base de datos para el sku : ${extraMessage}`, {
            duration: 4000,
            position: 'top-right'
        });
    } else if(value === 'update_success') {
        toast.success(`Actualizado con éxito el recored para el sku: ${extraMessage} en la base de datos.`, {
            duration: 4000,
            position: 'top-right'
        });
    }
    
    else { //failed cases
        toast.error('No se ha encontrado ninguna alerta. Terminación de sesión.', {
            duration: 2500,
            position: 'top-right'
        });
    }
};

export const checkData = () => {
    let error = {}
    let re = /(\.jpg|\.jpeg|\.bmp|\.gif|\.png)$/i; //file validation checking, accept only image file'
    console.log('Found problem here')
    // if(!formData.alert) {
    //     error['alert'] = true;
    // }
    // if(!formData.comentario) {
    //     error['comentario'] = true;
    // }
    return error;
}

export const FormBody = ({responseType, storeOptions, userData, currentCountry, onLogoutClick}) => {

    // confirm save modal
    const [openSaveModal, setOpenSaveModal] = useState(false);
    // check for missing fields to show save confirm modal
    const [missingFields, setMissingFields] = useState([]);

    // edit modal
    const [showEditModal, setShowEditModal] = useState(false);



    //keep track of the submitted data.
    const [submitCounter, setSubmitCounter] = useState(0);

    //date
    const today = new Date();

    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = String(today.getFullYear());
    
    const dateString = `${day}-${month}-${year}`;
    console.log(dateString);
    const [storeValue, setStoreValue] = useState("");

    const [confirmSubmission, setConfirmSubmission] = useState(false);

    const [savedCheckbox, setSavedCheckbox] = useState([]);


    const {apiLoading, apiResponse} = useProductData(storeValue, currentCountry, onLogoutClick);

    //answerdProduct
    const [allProducts, setAllProducts] = useState([]);
    // not answeredProduct
    const [notAnsweredProducts, setNotAnsweredProducts] = useState([]);
    const [selectedFamilyProducts, setSelectedFamilyProducts] = useState([]);


    const [submitLoading, setSubmitLoading] = useState(false);

    const [responseCacheKey, setResponseCacheKey] = useState(null);
    
    const [selectedFiles, setSelectedFiles] = useState({first: null, second: null, third: null});
    const [fileNames, setFileNames] = useState({first: null, second: null, third: null}); //filename

    const [currentFamilyName, setCurrentFamilyName] = useState('');


    const [responseData, setResponseData] = useState([]);
    const [familyData, setFamilyData] = useState([]);

    const [skuItems, setSkuItems] = useState([]);

    const [currentSelectedSku, setCurrentSelectedSKU] = useState("");

    const [productContent, setProductContent] = useState(null);



    const [productData, setProductData] = useState(null);

    const [formData, setFormData] = useState(initialFormData)

    const [errorField, setErrorField] = useState(initialErrorField); // check error in the input field, all field is required. so if all field are properly given, the the error will be false

    const [uploading, setUploading] = useState(false); // check file uploading state...
    

    const handleSubmit = (subType) => {
        let userSub = {...subType};
        var confirm = handleConfirmSubmission(subType);
        if(!confirm) {
            return;
        }
        console.log(userSub);

        if(userSub.type === 'save_form') {
            let res = checkAllCompleteValidation(formData);
            if(res) {
                console.log('completed form data for testing');
                if(formData.action_taken.includes('Ortos') && !formData.action_detail) {
                    console.log('Not submitting to bigquery')
                } else {
                    userSub.type = 'normal';
                    userSub.blank = true
                }
            }
        }
        // return;
        // e.preventDefault();

        let error = checkData(formData);
        console.log('error', error);
        console.log('errfield', errorField);

        console.log('Submitting the form: ');
        console.log('Formdata: ', formData);
        // return;
        // if(!formData.item_sku_num ||!formData.tienda ||!formData.alert) {
        //     showToastMessage('error');
        //     return;
        // }
        console.log('form payload: ', formData)
        setUploading(true);
        setSubmitLoading(true);
        let files = [
            selectedFiles.first ?? "",
            selectedFiles.second ?? ""
          ];

          if(selectedFiles.third) {
            files = [...files, selectedFiles.third ?? ""]
          }

          console.log('Filessssss: ', files);

          let imgData = {
            first: selectedFiles.first ?? '',
            second: selectedFiles.second ?? '',
            third: selectedFiles.third ?? ''
          }
        
          const filePromises = Object.keys(imgData).map((key) => {
            const file = selectedFiles[key];
            if (file) {
              return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => {
                  const vals = reader.result.split(',');
                  const obj = {
                    fileName: file.name,
                    mimeType: file.type,
                    data: vals[1],
                  };
                  resolve({ key, value: obj });
                };
                reader.onerror = () => {
                  reject(reader.error);
                };
                reader.readAsDataURL(file);
              });
            } else {
              return Promise.resolve({ key, value: '' });
            }
          });

          Promise.allSettled(filePromises)
            .then((fileObjects) => {
                console.log(fileObjects)
                // let imgData = fileObjects.filter(result => result.status === 'fulfilled').map(item => item.value ? item.value.data : "");
                fileObjects.forEach(result => {
                    if(result.status === 'fulfilled') {
                        const { key, value } = result.value;
                        imgData[key] = value;
                    } else {
                        console.log(result.reason);
                    }
                })
                console.log('fulllfilled image data: ');
                console.log(imgData)

                axios.post('/api/save-data', { imgData, formData, responseCacheKey, userSub, userData })
                .then(response => {
                  successResponseHandler(response)
                  setSubmitLoading(false);
                  setSubmitCounter(prev => prev + 1);
                  setSelectedFiles({first: null, second: null, third: null });
                console.log('success...');
                console.log(response);
                })
                .catch(error => {
                  console.log(error);
                  showToastMessage('failed')
                  setLoading(false);
                  setUploading(false)
                  setSubmitLoading(false)
                  setSubmitCounter(prev => prev + 1);
                  setSelectedFiles({first: null, second: null, third: null })
                //   setTimeout(() => {
                //     window.location.reload(); 
                //   },5000)
                });
            })
    }


    const handleStoreSelect = (e) => {
        setStoreValue(e.target.value);
        console.log(e.target.value)
    }

    const handleFamilySelection = (familyName) => {
        let flag = false;
        console.log('triggered from handle saved family for now..');
        console.log(familyName);
        setCurrentFamilyName(familyName);
        console.log('updating family name current')
        if(!familyName && responseType !== 'sku') {
            setProductContent(null);
            setFormData(initialFormData);
            setFileNames({first: null, second: null, third: null });
            return; // no need to do anything
        }
        const filteredFamilyData = familyData.filter(data => {
            return data.family === familyName
        })?.[0]
        console.log('filteredFamilyData: ', filteredFamilyData);
        setSelectedFamilyProducts(filteredFamilyData?.data);
        // setSkuItems(filteredFamilyData.data)
        // 
        var incompleteData = filteredFamilyData?.data.find(item => item.completed === false);
        console.log('new imcomplete searching...');
        console.log(incompleteData);
        let savedData = filteredFamilyData?.data.find(item => item.hasOwnProperty('saved'));
        console.log('new saved data....');
        console.log(savedData);
        if(savedData) {
            console.log('saved Data Found');
            console.log(savedData);
            setProductContent(savedData);
            setFormData((prev) => ({
                ...prev,
                product_name: savedData.product_name ?? '',
                tienda : getStoreName(storeOptions, savedData.location_id),
                fecha_alerta: savedData.fecha_alerta ?? '',
                item_sku_num: savedData?.item_sku_num ?? '',
                familia: savedData.hier_family_name ?? '',
                subfamilia: savedData.hier_subfamily_name ?? '',
                departamento: savedData.hier_department_name ?? '',
                venta_esperada: savedData.venta_esperada ?? '',
                venta_potencial: savedData.venta_potencial ?? '',
                venta_total:  savedData.venta_total ?? '',
                grupo: savedData?.grupo ?? "",
                conjunto: savedData?.conjunto ?? "",
                action_taken: savedData?.action_taken ?? [],
                action_detail: savedData?.action_detail,
                comentario: savedData?.comentario,
                alert: savedData?.alert,
                antesUrl: savedData?.antesUrl,
                antesName: savedData?.antesName,
                despuesUrl: savedData?.despuesUrl,
                despuesName: savedData?.despuesName,
                competenciaUrl: savedData?.competenciaUrl,
                competenciaName: savedData?.competenciaName,
                numero_alerta:  savedData?.sku_ranking, // update the ranking in the form
                country_id: savedData?.country_id,
                location_id: savedData?.location_id,
              }))
    
              setSavedCheckbox(savedData?.action_taken);
              setFileNames(prev => ({...prev, first: savedData.antesName, second: savedData.despuesName, third: savedData.competenciaName }))
              // saved complete 
              return;

        }
        console.log('updated incomplete data', incompleteData);
        if(!incompleteData && familyData.length) {
            flag = true;
            flag && !apiLoading && showToastMessage('No alert');
            flag = false;
            setProductContent(null);
            setFormData(initialFormData);
            setFileNames({first: null, second: null, third: null });
            return;
        }
        console.log('ading new family data to state after updating...');
        console.log(incompleteData);
        setProductContent(incompleteData);
        setFormData((prev) => ({
            ...prev,
            product_name: incompleteData.product_name ?? '',
            tienda : getStoreName(storeOptions, incompleteData.location_id),
            fecha_alerta: incompleteData.fecha_alerta ?? '',
            item_sku_num: incompleteData?.item_sku_num ?? '',
            familia: incompleteData.hier_family_name ?? '',
            subfamilia: incompleteData.hier_subfamily_name ?? '',
            departamento: incompleteData.hier_department_name ?? '',
            venta_esperada: incompleteData.venta_esperada ?? '',
            venta_potencial: incompleteData.venta_potencial ?? '',
            venta_total:  incompleteData.venta_total ?? '',
            grupo: incompleteData?.grupo ?? "",
            conjunto: incompleteData?.conjunto ?? "",
            action_taken: incompleteData?.action_taken ?? [],
            action_detail: incompleteData?.action_detail,
            comentario: incompleteData?.comentario,
            alert: incompleteData?.alert,
            antesUrl: incompleteData?.antesUrl,
            antesName: incompleteData?.antesName,
            despuesUrl: incompleteData?.despuesUrl,
            despuesName: incompleteData?.despuesName,
            competenciaUrl: incompleteData?.competenciaUrl,
            competenciaName: incompleteData?.competenciaName,
            numero_alerta: incompleteData?.sku_ranking, // update the ranking in the form
            country_id: incompleteData?.country_id,
            location_id: incompleteData?.location_id
          }))
          setFileNames(prev => ({...prev, first: incompleteData.antesName, second: incompleteData.despuesName, third: incompleteData.competenciaName }))

          setSavedCheckbox(incompleteData?.action_taken)

    }


    function successResponseHandler(res) {
        console.log('Start success response....')
        console.log('res', res);
        if (res.status === 'success') {
            showToastMessage('success');
            setFormData(initialFormData);
            //update the edited component
            setAllProducts(getSkuRanking(res.responseData.response.response)?.filter(item => item.completed && !item?.saved));
            setNotAnsweredProducts(getSkuRanking(res.responseData.response.response));
            setFileNames({ first: null, second: null, third: null });
            updateAllState({responseType, apiResponse: res.responseData.response, setFamilyData, setProductContent, setFormData, showToastMessage, setResponseCacheKey, setSavedCheckbox, handleFamilySelection, setCurrentFamilyName, storeOptions, setFileNames, apiLoading });
            if(responseType === 'familia') {
                console.log('I am running from 325 line in handle family selection...')
                console.log('currentFamilyName', currentFamilyName);
                // handleFamilySelection(currentFamilyName);
            }
            console.log('Calling to update all state');
        } else if(res.status === 'failed') {
            showToastMessage('failed')
            return;
        } else if(res.status === 'completed') {
            console.log('response completed.....')
            showToastMessage('completed');
            setFamilyData([]);
            setProductContent(null);
            setFormData(initialFormData);
            setFileNames({ first: null, second: null, third: null });
            setUploading(false);
            setStoreValue("");
            setErrorField(initialErrorField);
            return;
        } else if(res.status === 'blank') {
            console.log('response completed.....')
            showToastMessage('success');
            setFamilyData([]);
            setProductContent(null);
            setFormData(initialFormData);
            setFileNames({ first: null, second: null, third: null });
            setUploading(false);
            setStoreValue("");
            setErrorField(initialErrorField);
            return;
        } else if(res.status === 'already_submitted') {
            showToastMessage('already_submitted');
            // setTimeout(() => {
            //     window.location.reload(); 
            //   },5000)
            return;
        }

        // setLoading(false);
        setUploading(false);

        setErrorField(initialErrorField);
        
    }

    const handleFormFieldChange = (e) => {
        console.log("Checking the update handle form field iwth event");
        console.log(e.target.value)
        setFormData((prev) => ({
            ...prev,
            [e.target.name] : e.target.value
        }))
    }

    // last button disabled
    let disabledLastButton;
    if(responseType === 'sku') {
        disabledLastButton = productContent?.sku_ranking === productContent?.total_length ? false : true;
    }else {
        disabledLastButton = productContent?.family_ranking === productContent?.total_family_length ? false : true;

    }

    // handle confirma submission
    const handleConfirmSubmission = (subType) => {
        if(subType.type === 'save_form') {
            return true;
        }
        console.log('action taken: ')
        console.log(formData.action_taken)
        if(!formData.item_sku_num || !formData.tienda || !formData.action_taken || !formData.alert) {
            showToastMessage('error');
            // setConfirmSubmission(false);
            console.log('rejected from 462');
            return false;
        } else if(!selectedFiles.first || (formData.action_taken.includes("Precio más alto que en la competencia") && !selectedFiles.third)) {
            if(!selectedFiles.first && !formData.antesUrl) {
                showToastMessage('error');
                console.log('rejected from 467');
                return false;
            }
            // if(!selectedFiles.second && !formData.despuesUrl) {
            //     showToastMessage('error');
            //     console.log('rejected from 472');
            //     return false;
            // }
            
            if((formData.action_taken.includes("Precio más alto que en la competencia") && !selectedFiles.third)) {
                if(!formData.competenciaUrl) {
                    showToastMessage('error');
                    console.log('rejected from 479');
                    return;
                }
            }
            // set other comment field mendatory if the checkbox is checked
            console.log(formData);
            return true;
        } else if(formData.action_taken.includes('Otros') && !formData.action_detail) {
            showToastMessage('error');
            console.log('rejected from 528');
            return false;
        } else {
            return true;
        }
    }

    function checkAllCompleteValidation() {
        if(!formData.item_sku_num || !formData.tienda || !formData.action_taken || !formData.alert) {
            return false;
        } else if(!selectedFiles.first || (formData.action_taken.includes("Precio más alto que en la competencia") && !selectedFiles.third)) {
            if(!selectedFiles.first && !formData.antesUrl) {
                return false;
            }
            // if(!selectedFiles.second && !formData.despuesUrl) {
            //     return false;
            // }
            
            if((formData.action_taken.includes("Precio más alto que en la competencia") && !selectedFiles.third)) {
                if(!formData.competenciaUrl) {
                    return false;
                }
            }
            console.log('I am here form form confirm valiation for final revision');
            console.log(formData);
            if(formData.action_taken?.includes('Otros') && !formData.action_detail) {
                return false;
            }
            return true;
        } else if(formData.action_taken?.includes('Otros') && !formData.action_detail) {
            return false;
        } else {
            return true;
        }
    }

    // handle confirm save form
    const handleConfirmSave = () => {
        console.log('Hello..');

        let missingFields = getAllCompleteInputState(formData, selectedFiles);

        if(missingFields.length) {
            setOpenSaveModal(true);
        } else {
            handleSubmit({type: 'save_form', storeValue, currentFamilyName: currentFamilyName ?? "" });
        }

    }

    const handleSaveCallback = () => {
        handleSubmit({type: 'save_form', storeValue, currentFamilyName: currentFamilyName ?? "" });
    }

    // handle next / prev alert selection
    function handleAlertSwitching(type) {
        if(responseType === 'sku' && notAnsweredProducts.length === 0) return;
        if(responseType === 'familia' && familyData.length === 0) return;
        let currentAlertNumber = responseType === 'sku' ? productContent.sku_ranking : productContent.family_ranking;
        let selectStr = responseType === 'sku' ? 'sku_ranking' : 'family_ranking';
        let totalLength = responseType === 'sku' ? productContent.total_length : productContent.total_family_length;
        
        let targetArray = responseType === 'sku' ? [...notAnsweredProducts] : [...selectedFamilyProducts];
        console.log(currentAlertNumber);
        console.log(totalLength);
        // return;
        if(type == 'next') {
            console.log('try next click');
            console.log(notAnsweredProducts);
            if(currentAlertNumber >= totalLength) return;

            // let currentAlertNumber = productContent.numero_alerta;
            // let newChunk = allProducts.slice(currentAlertNumber);
            // let targetIncompletedItem = newChunk.find(item => item.completed === false);
            // if(targetIncompletedItem) {
            //     setProductContent(targetIncompletedItem);
            // }
            console.log(currentAlertNumber);
            console.log(targetArray);
            console.log(targetArray.length);
            while(currentAlertNumber < targetArray.length) {
                console.log('try for finding next item: ' + (currentAlertNumber + 1));
                let targetItem = targetArray.find(item => (item[selectStr] === currentAlertNumber + 1 && item.completed === false) || (item[selectStr] === currentAlertNumber + 1 && item.completed === true && item.hasOwnProperty('saved') && item?.saved === true));
                if(targetItem) {
                    console.log('I should run if next found!')

                    setProductContent(targetItem);
                    reflectWithFormData(targetItem);
                    break;
                }
                currentAlertNumber++;
            }
        } else if(type == 'prev') {
            console.log('try prev ' + (currentAlertNumber - 1));
            if(currentAlertNumber == 1) return;
            // let currentAlertNumber = productContent.numero_alerta;
            while(currentAlertNumber > 1) {
                console.log('I should run if prev found!')
                let targetItem = targetArray.find(item => (item[selectStr] === currentAlertNumber -1 && item.completed === false) || (item[selectStr] === currentAlertNumber -1 && item.completed === true && item.hasOwnProperty('saved') && item?.saved === true));
                if(targetItem) {
                    setProductContent(targetItem);
                    reflectWithFormData(targetItem);
                    break;
                }
                currentAlertNumber--;
            }
        }
    }

    // update the form data for nex-prev selection
    function reflectWithFormData(savedData) {
        setFormData((prev) => ({
            ...prev,
            product_name: savedData.product_name ?? '',
            tienda : getStoreName(storeOptions, savedData.location_id),
            fecha_alerta: savedData.fecha_alerta ?? '',
            item_sku_num: savedData?.item_sku_num ?? '',
            familia: savedData.hier_family_name ?? '',
            subfamilia: savedData.hier_subfamily_name ?? '',
            departamento: savedData.hier_department_name ?? '',
            venta_esperada: savedData.venta_esperada ?? '',
            venta_potencial: savedData.venta_potencial ?? '',
            venta_total:  savedData.venta_total ?? '',
            grupo: savedData?.grupo ?? "",
            conjunto: savedData?.conjunto ?? "",
            action_taken: savedData?.action_taken ?? [],
            action_detail: savedData?.action_detail,
            comentario: savedData?.comentario,
            alert: savedData?.alert,
            antesUrl: savedData?.antesUrl,
            antesName: savedData?.antesName,
            despuesUrl: savedData?.despuesUrl,
            despuesName: savedData?.despuesName,
            competenciaUrl: savedData?.competenciaUrl,
            competenciaName: savedData?.competenciaName,
            numero_alerta:  savedData?.sku_ranking, // update the ranking in the form
            country_id: savedData?.country_id,
            location_id: savedData?.location_id,
          }));
          setSavedCheckbox(savedData?.action_taken);
          setFileNames(prev => ({...prev, first: savedData.antesName, second: savedData.despuesName, third: savedData.competenciaName }))
    }



    useEffect(() => {
    },[JSON.stringify(errorField)])

    useEffect(() => {
        setConfirmSubmission(false);
        console.log('Selected Files:::: ');
        console.log(selectedFiles)
    },[selectedFiles])

    useEffect(() => {
        console.log(productContent,'productContent')
        // console.log('selected option: ', selectedOptions)
    },[currentSelectedSku, selectedFiles])

    useEffect(() => {
        console.log('Current updated product content:::')
        console.log(productContent)
                // updating form data with numero_alerta
    },[JSON.stringify(productContent)])

    useEffect(() => {
        console.log('response data state: ')
    }, [currentSelectedSku]);

    const [loading, setLoading] = useState(false);


    useEffect(() => {
        console.log('changing theproduct content')
    },[productContent])

    useEffect(() => {
        console.log('api product content updated!')
        // setProductContent(apiProductContent);

        updateAllState({responseType, apiResponse, setFamilyData, setProductContent, setFormData, showToastMessage, setResponseCacheKey, setSelectedFiles, handleFamilySelection, setSavedCheckbox, setCurrentFamilyName, storeOptions, setFileNames, apiLoading });
    },[apiLoading])

    useEffect(() => {
        console.log('api loding updated');
        console.log(loading)
        setLoading(apiLoading)
        if(apiResponse?.response) {
            setAllProducts(getSkuRanking(apiResponse.response)?.filter(item => item.completed && !item?.saved));
            setNotAnsweredProducts(getSkuRanking(apiResponse.response));
        }
        
    },[apiLoading])

    useEffect(() => {
        console.log('new all products..')
    },[allProducts])

    useEffect(() => {
        console.log('Updated submission...');
    },[loading])

    useEffect(() => {
        if(currentFamilyName && familyData.length) {
            console.log('gotcha for family')
            handleFamilySelection(currentFamilyName);
        }
    },[familyData])

    // useEffect(() => {
    //     console.log('triggering for current faily selection..');
    //     console.log(currentFamilyName);
    //     handleFamilySelection(currentFamilyName)
    // },[currentFamilyName])

    useEffect(() =>{
        console.log('new change from family selection...');
        console.log(formData)
    },[formData])

    //stop scrolling on mouse outside the modal
    useEffect(() => {
        // Disable scrolling when modal is open
        if (showEditModal) {
          document.body.style.overflow = "hidden";
        } else {
          document.body.style.overflow = "auto";
        }
      }, [showEditModal]);

      // countrychange track
      useEffect(() => {
        setStoreValue("")
        console.log('State change notieced', currentCountry)
      },[currentCountry])

    return (
        <div style={{overflow: showEditModal ? 'hidden' : ''}} className='overflow-hidden'>
            <form className="w-full max-w-full mt-2 min-h-[300px] md:min-h-[600px] h-[100%] pb-[100px] md:pb-[200px] px-6 md:px-14 bg-white" onSubmit={handleSubmit}>
                <div className='flex flex-row'>
                    <div className='w-full flex flex-col md:flex-row justify-start flex-wrap relative'>
                        <div className="flex flex-row items-center justify-start mr-8">
                            <label className="block tracking-wide text-gray-700 mb-3 w-[93px] md:w-auto pr-10" htmlFor="family-name">
                                Tienda:
                            </label>
                            <div className="relative">
                                <select name='store' className={`group-hover:block block appearance-none w-full min-w-[200px] md:min-w-[230px] ${errorField.store ? 'border border-red-600' : 'border'} bg-white text-gray-700 py-1 px-2 mb-3 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500 cursor-pointer border-gray-400`} id="grid-state"
                                value={storeValue}
                                onChange={handleStoreSelect}>
                                <option className='hover:text-gray-700  bg-gray-50 hover:bg-gray-100 py-2 px-4 block whitespace-no-wrap hover:cursor-pointer' value={''}>Elegir tienda...</option>
                                {storeOptions.map(store => (
                                    <option className='hover:text-gray-700  bg-gray-50 hover:bg-gray-100 py-2 px-4 block whitespace-no-wrap hover:cursor-pointer' key={store.location_id} value={store.location_id}>{store.tienda}</option>
                                    
                                ))}
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 mb-2 text-gray-700">
                                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                                </div>
                            </div>
                        </div>
                        {responseType === "familia" && (
                            <div className="flex flex-row items-center mr-8">
                                <label className="block tracking-wide text-gray-700 font mb-3 w-[93px] md:w-auto pr-10" htmlFor="family-name">
                                    Familia:
                                </label>
                                <SelectFamily familyName={familyData} selectFamily={(data) => handleFamilySelection(data)} storeValue={storeValue} currentFamilyName={currentFamilyName} setCurrentFamilyName={setCurrentFamilyName} submitCounter={submitCounter} />
                            </div>
                        )}
                        {productContent && (
                            <div className="flex flex-row items-center">
                                <div className="tracking-wide text-gray-700 mb-3 w-full text-sm flex gap-8">
                                        <span><span className='font-bold'>N° Alerta:</span>
                                        {responseType === 'sku' ? productContent?.sku_ranking + ' / (' + productContent?.total_length + ')'  :
                                         productContent?.family_ranking + ' / (' + productContent?.total_family_length + ')' }
                                         </span>
                                        <span><span className='font-bold'>Fecha Alerta:</span>{' '}{ productContent?.semana }</span>
                                </div> 
                            </div>
                        )}
                    </div>
                </div>
                    {productContent && (
                        <div className='w-full flex flex-col md:flex-row justify-start flex-wrap relative'>
                            <div className="flex flex-row items-center mt-2">
                                <button type="button" onClick={() => handleAlertSwitching('prev')} className='text-gray-900 bg-[#ccefef] border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-4 py-1.5 mr-2 mb-2 '><FontAwesomeIcon style={{fontSize: 15 }} icon={faChevronLeft} />{' '}Anterior</button>
                                <button type="button" onClick={() => handleAlertSwitching('next')} className='text-gray-900 bg-[#ccefef] border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-4 py-1.5 mr-2 mb-2 '>Siguiente{' '}<FontAwesomeIcon style={{fontSize: 15 }} icon={faChevronRight} /></button>
                            </div>
                        </div>
                    )}
                    {productContent && ( 
                        <div className='w-full test-class'>
                            <ProductContent data={productContent} />
                            <UserResponse formData={formData} setFormData={setFormData} handleFormFieldChange={handleFormFieldChange} errorField={errorField} setSelectedFiles={setSelectedFiles} submitCounter={submitCounter} apiLoading={apiLoading} savedCheckbox={savedCheckbox} fileNames={fileNames} setFileNames={setFileNames} />
                            <div className='flex justify-end gap-4 mt-14 md:mt-24 flex-col md:flex-row items-center'>
                                {allProducts.length ? (<div className='order-2 mr-4 cursor-pointer'>
                                    <button onClick={() => setShowEditModal(true)} type='button' className='edit-alert-btn underline order-2 md:order-1'>Modificar anteriores</button>
                                </div>) : null}
                                <div className='order-1 flex justify-end gap-4 md:order-2'>
                                    <div className='submit-buttonalign-bottom relative'>
                                        <button type='button' onClick={() => handleSubmit({type: 'normal', storeValue, currentFamilyName: currentFamilyName ?? "" })} className=' bg-[#0FA193] text-white px-5 py-3 font-bold text-sm  rounded disabled:bg-[#91A6A4] transition duration-200 ease-in-out'>Siguiente Alerta</button> 
                                    </div>
                                    <div className='submit-buttonalign-bottom relative'>
                                        <button type="button" onClick={handleConfirmSave} className='bg-slate-400 text-white px-5 py-3 rounded font-bold text-sm  disabled:bg-slate-400 disabled:cursor-not-allowed transition duration-200 ease-in-out'>Finalizar Revisión</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
            </form>
            {!productContent && allProducts.length ? (<div className='order-2 mr-4 cursor-pointer absolute bottom-10 right-8'>
                                    <button onClick={() => setShowEditModal(true)} type='button' className='edit-alert-btn underline order-2 md:order-1'>Modificar anteriores</button>
                                </div>) : null}
            {showEditModal && <EditModal setShowEditModal={setShowEditModal} products={allProducts} setAllProducts={setAllProducts} responseCacheKey={responseCacheKey} />}
            {openSaveModal && <ConfirmSaveModal  setOpenSaveModal={setOpenSaveModal} formData={formData} selectedFiles={selectedFiles} handleSaveCallback={handleSaveCallback} />}
            <Toaster />
            {
                loading && (
                    <div className="loading-overlay">
                        <div className="loading-spinner"></div>
                    </div>
                )
            }
            {
                submitLoading && (
                    <div className="loading-overlay">
                        <div className="loading-spinner"></div>
                    </div>
                )
            }
        </div>
      )
}
