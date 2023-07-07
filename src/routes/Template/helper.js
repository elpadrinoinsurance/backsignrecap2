const { mapObject, isJSON } = require('../../utils/common')
const { ERROR_TYPES } = require('../../Errors/constants');
const { HttpStatusError } = require('../../Errors/http-status-error');


const validateOnTemplateCreate = ({schemas, sampledata, columns}) => {
    //validate stringified data
    if(!isJSON(schemas)) throw HttpStatusError.badRequest({message: "the schemas are not in json format", type: ERROR_TYPES.ERROR})
    if(!isJSON(sampledata)) throw HttpStatusError.badRequest({message: "the sampledata is not in json format", type: ERROR_TYPES.ERROR})
    if(!isJSON(columns)) throw HttpStatusError.badRequest({message: "the columns are not in json format", type: ERROR_TYPES.ERROR})

    const parsedColumns = JSON.parse(columns)
    const parsedSchemas = JSON.parse(schemas)
    const parsedSampleData = JSON.parse(sampledata)
    //validate that there are at least one field
    if(parsedSchemas.length < 1) throw HttpStatusError.badRequest({ message: "debe haber por lo menos 1 campo creado", type: ERROR_TYPES.ERROR})
    //validate that there are just one page
    if(parsedSchemas.length !== 1) throw HttpStatusError.badRequest({message: "el numero de paginas debe ser 1", type: ERROR_TYPES.ERROR})
    if(parsedSampleData.length !== 1) throw HttpStatusError.badRequest({message: "el numero de paginas debe ser 1", type: ERROR_TYPES.ERROR})

    //validate that the fields on schemas and sample matches columns
    mapObject(parsedSchemas[0], (key) => {
        if(parsedColumns.some(column => column === key)) return key
        else throw HttpStatusError.badRequest({message: "field information does not match with schema", type: ERROR_TYPES.ERROR})
    })
    mapObject(parsedSampleData[0], (key) => {
        if(parsedColumns.some(column => column === key)) return key
        else throw HttpStatusError.badRequest({message: "field information does not match with sampleData", type: ERROR_TYPES.ERROR})
    })

    //validate that signature exists
    const signature = (parsedSchemas[0])['signature']
    if(!signature) throw HttpStatusError.badRequest({message: 'falta campo signature', type: ERROR_TYPES.ERROR})
    if(signature['type'] !== 'image') throw HttpStatusError.badRequest({message: 'signature debe estar en formato imagen', type: ERROR_TYPES.ERROR})
}

module.exports = {
    validateOnTemplateCreate
}