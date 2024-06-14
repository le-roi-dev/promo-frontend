function getMissingFields(data) {
    let str = "";
    if(
        !data?.action_taken.length ||
         data?.action_taken.includes('Otros') && !data.action_detail
    ) {
        str += 'Motivo/Acción \n';
    }

    if(!data?.antesUrl) {
        str += 'Foto Antes \n'
    }

    if(
        data?.action_taken?.includes("Precio más alto que en la competencia") && !data.competenciaUrl
    ) {
        str += 'Foto Competencia \n'
    }

    if(data.alert != 0 || data.alert != 1) {
        str += 'Utilidad Alerta \n'
    }


    return str.slice(0,-2);
}

export default getMissingFields;