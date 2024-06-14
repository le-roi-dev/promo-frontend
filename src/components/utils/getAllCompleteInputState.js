function getAllCompleteInputState(formData, selectedFiles) {
    let msgArr = [];
    if(
        !formData?.action_taken.length ||
         formData?.action_taken.includes('Otros') && !formData.action_detail
    ) {
        msgArr.push("Motivo/Acción ");
    }

    if(!formData?.antesUrl) {
        if(!selectedFiles.first) {
            msgArr.push("Foto Antes");
        }
    }

    if(!formData.competenciaUrl) {
        if(formData.action_taken.includes("Precio más alto que en la competencia") && !selectedFiles.third ) {
            msgArr.push("Foto Competencia");
        }
    }

    if(!!formData.alert == false) {
        msgArr.push("Utilidad Alerta");
    }

    return msgArr;
}

export default getAllCompleteInputState