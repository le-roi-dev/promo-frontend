import { initialFormData } from "../FormBody";
import getStoreName from "./getStoreName";
import getMissingFields from "./getMissingFields";

export const getSkuRanking = (response) => {
  var allSkuData = [];
  for(let i = 0; i < response.length; i++) {
      allSkuData = [...allSkuData, ...response[i].data];
  }
  var sortedArray = allSkuData.sort((a, b) => b.venta_potencial - a.venta_potencial);

  var skuRanking = sortedArray.map((item, index) => {
      return {
      ...item,
      sku_ranking: index+1,
      total_length: sortedArray.length
      }
  })

  return skuRanking;
}

const getCurrentRank = (data, currentSku) => {
  console.log(data, currentSku)
  let rank = data.find(item => item.item_sku_num == currentSku);
  if(rank) {
    return rank.sku_ranking
  }

  return "";
}

const updateAllState = ({responseType, apiResponse, setFamilyData, setProductContent, setFormData, showToastMessage, setResponseCacheKey, setSelectedFiles, handleFamilySelection, setSavedCheckbox, setCurrentFamilyName, storeOptions, setFileNames, apiLoading }) => {
    // case for no alert found
    if(!apiResponse) {
        console.log('initial call... dont know why...');

        return;
    }
    console.log(' new api response:::: ', apiResponse);
    const { cacheKey, response } = apiResponse;
    if(cacheKey) {
        setResponseCacheKey(cacheKey);
    }
    if(!response || !response?.length) {
        // no alert found.  

        setProductContent(null);
        setFamilyData([]);
        setFormData(initialFormData);
    }



    if(responseType === "sku") { // allAlerts selection

        let skuRanking = getSkuRanking(response); 

        var productData = skuRanking.find((item) => (item.completed === false) || (item.completed === true && item.hasOwnProperty('saved') && item?.saved === true));
        if(!productData) {
            !apiLoading && showToastMessage('No alert');
            setProductContent(null);
            setFormData(initialFormData);
            console.log('No product data found');
            return;
        }

        console.log('current alert: ');
        console.log('product data' + productData);

        // check if there any previous saved data
        console.log(productData);

        // var savedData;

        // update product data if any previous saved data found
        let savedProduct = skuRanking.find(item => item.hasOwnProperty('saved'));

        if(savedProduct) {
          productData = savedProduct;
          console.log('saved product found');
          console.log(savedProduct);
          let missingFieldString = getMissingFields(savedProduct);
          !apiLoading && showToastMessage('incomplete notice', missingFieldString);
        } 

        console.log('after saved: ', productData)
        setProductContent(productData);
        setFormData((prev) => ({
            ...prev,
            product_name: productData.product_name ?? '',
            tienda : getStoreName(storeOptions, productData.location_id),
            fecha_alerta: productData.fecha_alerta ?? '',
            item_sku_num: productData?.item_sku_num ?? '',
            familia: productData.hier_family_name ?? '',
            subfamilia: productData.hier_subfamily_name ?? '',
            departamento: productData.hier_department_name ?? '',
            venta_esperada: productData.venta_esperada ?? '',
            venta_potencial: productData.venta_potencial ?? '',
            venta_total:  productData.venta_total ?? '',
            grupo: productData?.grupo ?? "",
            conjunto: productData?.conjunto ?? "",
            action_taken: productData?.action_taken ?? [],
            action_detail: productData?.action_detail ?? '',
            comentario: productData?.comentario ?? '',
            alert: productData?.alert ?? '',
            antesUrl: productData?.antesUrl ?? "",
            antesName: productData?.antesName ?? "",
            despuesUrl: productData?.despuesUrl ?? "",
            despuesName: productData?.despuesName ?? "",
            competenciaUrl: productData?.competenciaUrl ?? "",
            competenciaName: productData?.competenciaName ?? "",
            numero_alerta: productData?.sku_ranking,
            country_id: productData?.country_id ?? "",
            location_id: productData?.location_id ?? null
          }))

          setFileNames(prev => ({ ...prev, first: productData.antesName, second: productData.despuesName, third: productData.competenciaName }));

          //setting saved checkbox data
          setSavedCheckbox(productData?.action_taken)

      } else if(responseType === "familia") { //family selection
        
        // sorting and find ranking
        let skuRanking = getSkuRanking(response);

        console.log('after getskuranking', skuRanking)

        let familyData = response.map(fData => {
          return {
            ...fData,
            data: fData.data?.sort((a,z) => z.venta_potencial - a.venta_potencial)
          }
        })
        let familyRanking = familyData.map(fData => {
            return {
              ...fData,
              data: fData.data?.map((item, index) => {
                return {
                  ...item,
                  family_ranking: index+1,
                  total_family_length: fData.data.length,
                  sku_ranking: getCurrentRank(skuRanking, item.item_sku_num),
                  total_length: skuRanking.length
                }
              })
            }
          })

        console.log('Checking family ranking!!!');
        console.log(familyRanking)
        setFamilyData(familyRanking);

        //** checking data that are saved from family */

        let productData = null;
        familyRanking.forEach(fData => {
          let dataArray = fData.data;
          dataArray.forEach(item => {
            if(item.hasOwnProperty('saved')) {
              productData = item;
            }
          })
        })
        console.log('Searching for saved family: ');
        console.log(productData)

        if(productData) {
          console.log('Im triggering him for family selection.....')
          // handleFamilySelection(productData.hier_family_name); //set the family selection for the family sorting data
          // setProductContent(productData);
          console.log(productData);
          setProductContent(productData);
          setFormData((prev) => ({
              ...prev,
              product_name: productData.product_name ?? '',
              tienda : getStoreName(storeOptions, productData.location_id),
              item_sku_num: productData?.item_sku_num ?? '',
              fecha_alerta: productData.fecha_alerta ?? '',
              familia: productData.hier_family_name ?? '',
              subfamilia: productData.hier_subfamily_name ?? '',
              departamento: productData.hier_department_name ?? '',
              venta_esperada: productData.venta_esperada ?? '',
              venta_potencial: productData.venta_potencial ?? '',
              venta_total:  productData.venta_total ?? '',
              grupo: productData?.grupo ?? "",
              conjunto: productData?.conjunto ?? "",
              action_taken: productData?.action_taken ?? [],
              action_detail: productData?.action_detail ?? '',
              comentario: productData?.comentario ?? '',
              alert: productData?.alert ?? '',
              antesUrl: productData?.antesUrl ?? "",
              antesName: productData?.antesName ?? "",
              despuesUrl: productData?.despuesUrl ?? "",
              despuesName: productData?.despuesName ?? "",
              competenciaUrl: productData?.competenciaUrl ?? "",
              competenciaName: productData?.competenciaName ?? "",
              numero_alerta: productData?.sku_ranking, // update the ranking in the form
              country_id: productData?.country_id ?? "",
              location_id: productData?.location_id ?? null,

            }))
            setFileNames(prev => ({ ...prev, first: productData.antesName, second: productData.despuesName, third: productData.competenciaName }));
  
            //setting saved checkbox data
            setSavedCheckbox(productData?.action_taken)
            setCurrentFamilyName(productData.hier_family_name);
            let missingFieldString = getMissingFields(productData);
            !apiLoading && showToastMessage('incomplete notice', missingFieldString);
        }
    }
}

export default updateAllState;