const { isJSON } = require('../../utils/common');
const { ERROR_TYPES } = require('../../Errors/constants');
const { HttpStatusError } = require('../../Errors/http-status-error');


const arrayHasProperty = (array, prop) => {
    return array.some(val => prop in val)
}

const isImageBase64 = (text) => {
    return /^data:image\//.test(text)
}

const isPDFBase64 = (text) => {
    return /^data:application\/pdf/.test(text)
}

const validateCreateDocument = (inputs) => {
    if(!isJSON(inputs)) throw HttpStatusError.badRequest({message: "inputs is not in json format", type: ERROR_TYPES.ERROR})
    const parsedInputs = JSON.parse(inputs)
    
    //validate that all fields were filled except signature
    const emptyFields = parsedInputs.reduce((counter, input) => {
        if(Object.keys(input).length < 1) counter++
    }, 0)
    if(emptyFields > 1) throw HttpStatusError.badRequest({ message: "todos los campos excepto signature deben ser llenados", type: ERROR_TYPES.ERROR })

    const hasSignature = parsedInputs.some(input => 'signature' in input)
    if(hasSignature) throw HttpStatusError.badRequest({ message: "signature debe estar vacio", type: ERROR_TYPES.ERROR })
}

module.exports = {
    arrayHasProperty,
    isImageBase64,
    validateCreateDocument,
    isPDFBase64
}