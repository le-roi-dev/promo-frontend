const getStoreName = (stores, locationId) => {
    let store = stores.filter(item => item.location_id == locationId)[0]
    return store.tienda
}

export default getStoreName;