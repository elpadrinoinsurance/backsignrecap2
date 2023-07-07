const { controllerWrapper, ModelFindById, ModelCount } = require('../../utils/common')
const Template = require('../../database/models/Template')
const Document = require('../../database/models/Document')
const Base = require('../../database/models/Base');
const {validateOnTemplateCreate} = require('./helper'); 
const { HttpStatusError } = require('../../Errors/http-status-error');
const { ERROR_TYPES } = require('../../Errors/constants');
const { socket } = require('../../socket');
const { roles } = require('../../database/constants');
const io = socket()

module.exports.get_template = controllerWrapper(async (req, res) => {
    const rol = req.user.rol
    const isAdmin = rol === roles.ADMIN
    const getOptions = isAdmin? {} : {madeBy: req.user._id}
    const templates = await Template.paginate(getOptions, req.pagination)
    res.json(templates)
})

module.exports.post_template = controllerWrapper(async (req, res) => {
    const {schemas, sampledata, baseId, columns, slug} = req.body
    const user = req.user
    validateOnTemplateCreate({schemas, sampledata, columns})
    const base = await ModelFindById(Base, baseId)
    const template = new Template({schemas, sampledata, base: base._id, columns, slug, madeBy: user._id })
    await template.save()
    io.to('admin').emit('addTemplate', template)
    res.json(template)
})

module.exports.get_template_id = controllerWrapper(async (req, res) => {
    const {id} = req.params
    const template = await ModelFindById(Template, id)    
    res.json(template)    
})

module.exports.delete_template_id = controllerWrapper(async (req, res) => {
    const {id} = req.params
    const documentsReferenced = await ModelCount(Document, "template", id)
    if(documentsReferenced > 0) throw HttpStatusError.badRequest({message: `esta planilla aun esta siendo usada por ${documentsReferenced} documentos`, type: ERROR_TYPES.ERROR})
    const template = await ModelFindById(Template, id)
    await Template.deleteOne({_id: template._id});
    io.emit('deleteTemplate', {id: template._id, madeBy: template.madeBy})
    res.json(template)  
})