const { controllerWrapper, ModelFindById } = require('../../utils/common')
const Document = require('../../database/models/Document')
const Template = require('../../database/models/Template')
const Base = require('../../database/models/Base')
const { HttpStatusError } = require('../../Errors/http-status-error');
const { isImageBase64, validateCreateDocument } = require('./helper');
const { ERROR_TYPES } = require('../../Errors/constants');
const { socket } = require('../../socket');
const { roles } = require('../../database/constants');
const io = socket()

module.exports.get_documents = controllerWrapper(async (req, res) => {
    const rol = req.user.rol
    const isAdmin = rol === roles.ADMIN
    const getOptions = isAdmin ? {} : {madeBy: req.user._id}
    const documents = await Document.paginate(getOptions, req.pagination)
    res.json(documents)
})

module.exports.post_document = controllerWrapper(async (req, res) => {
    const {inputs, templateId, slug} = req.body
    
    validateCreateDocument(inputs)
    const template = await ModelFindById(Template, templateId)
    if(!template) throw HttpStatusError.badRequest({message: "templateId no es valido", type: ERROR_TYPES.ERROR})
    const document = new Document({template: template._id, inputs, slug, madeBy: req.user._id})
    await document.save()
    io.to("admin").emit('addDoc', document)
    res.json(document)
})

module.exports.get_document_id = controllerWrapper(async (req, res) => {
    const {id} = req.params
    const document = await ModelFindById(Document, id)    
    res.json(document)    
})

module.exports.post_signature_document_id = controllerWrapper(async (req, res) => {
    const {id} = req.params
    const {signature} = req.body
    if(!isImageBase64(signature)) throw HttpStatusError.badRequest({message: "signature debe estar en formato imagen", type: ERROR_TYPES.ERROR})
    
    const document = await ModelFindById(Document, id)
    if(document.signature) throw HttpStatusError.badRequest({message: "este documento ya ha sido firmado", type: ERROR_TYPES.ERROR})

    const inputs = JSON.parse(document.inputs)
    inputs[0].signature = signature
    document.inputs = JSON.stringify(inputs)
    document.signature = true
    await document.save()
    io.emit('updateDoc', document._id)
    res.json(document)
})

module.exports.delete_document_id = controllerWrapper(async (req, res) => {
    const {id} = req.params
    const document = await ModelFindById(Document, id)
    await Document.deleteOne({_id: document._id})
    io.emit('deleteDoc', {id: document._id, madeBy: document.madeBy})
    res.json(document)
})

module.exports.delete_all_documents = controllerWrapper(async (req, res) => {
    const user = req.user
    const userId = user._id
    const queryOptions = user.rol === roles.ADMIN ? {} : {madeBy: userId}
    const documents = await Document.find(queryOptions, ["_id"])
    const deletedDocs = await Document.deleteMany(queryOptions);
    io.emit('deleteAllDoc', documents)
    res.json({deleted: deletedDocs.deletedCount})
})

module.exports.insert_batch_documents = controllerWrapper(async (req, res) => {
    const {dataset, templateId} = req.body
    if(!dataset || !templateId) throw HttpStatusError.badRequest({message: "hubo un error en la peticion", type: ERROR_TYPES.ERROR})
    const invalidDocuments = []
    const validDocuments = []
    const template = await ModelFindById(Template, templateId)
    if(!template) throw HttpStatusError.badRequest({message: "templateId no es valido", type: ERROR_TYPES.ERROR})
    for(const doc of dataset){
        const {inputs, slug} = doc
        try{
            validateCreateDocument(inputs)
            validDocuments.push({
                inputs,
                slug,
                madeBy: req.user._id,
                template: template._id
            })
        }
        catch(err){
            invalidDocuments.push(slug)
        }
    }
    const resp = await Document.insertMany(validDocuments)
    io.to("admin").emit("addDocsBatch", resp)
    res.json({inserted: resp.length, invalidDocuments})
})

module.exports.download_documents = controllerWrapper(async (req, res) => {
    const user = req.user
    const isAdmin = user.rol === roles.ADMIN
    const getOptions = isAdmin ? {} : {madeBy: user._id}
    const documents = await Document.find(getOptions).sort({'slug': 1})
    const templateIds = documents.reduce((templates, curr) => {
        if(templates.some(val => val.equals(curr.template))) return templates
        return [...templates, curr.template]
    }, [])
    const templates = await Template.find({_id: {$in: templateIds}})
    const baseIds = templates.reduce((bases, curr) => {
        if(bases.some(val => val.equals(curr.base))) return bases
        return [...bases, curr.base]
    }, [])
    const bases = await Base.find({_id: {$in: baseIds}})
    const body = {
        documents,
        templates,
        bases
    }
    res.json(body)
})