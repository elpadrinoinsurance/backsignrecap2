const { controllerWrapper, ModelFindById } = require('../../utils/common')
const Base = require('../../database/models/Base')
const { HttpStatusError } = require('../../Errors/http-status-error')
const Template = require('../../database/models/Template')
const { ModelCount } = require('../../utils/common')
const { ERROR_TYPES } = require('../../Errors/constants');
const { isPDFBase64 } = require('../Document/helper')
const { socket } = require('../../socket')
const { roles } = require('../../database/constants')
const io = socket()

module.exports.get_base = controllerWrapper(async (req, res) => {
    const rol = req.user.rol
    const isAdmin = rol === roles.ADMIN
    const getOptions = isAdmin? {} : {madeBy: req.user._id}
    const bases = await Base.paginate(getOptions, req.pagination)
    res.json(bases)
})

module.exports.post_base = controllerWrapper(async (req, res) => {
    const { basePdf, slug } = req.body
    const user = req.user
    if(!isPDFBase64(basePdf)) throw HttpStatusError.badRequest({message: "el pdf base debe tener formato pdf", type: ERROR_TYPES.ERROR})
    const base = new Base({ basePdf, slug, madeBy: user._id })
    await base.save();
    io.to("admin").emit('addBase', base)
    res.json(base)
})

module.exports.get_base_id = controllerWrapper(async (req, res) => {
    const {id} = req.params
    const base = await ModelFindById(Base, id)
    res.json(base)
})

module.exports.delete_base_id = controllerWrapper(async (req, res) => {
    const {id} = req.params
    const templatesReferenced = await ModelCount(Template, "base", id)
    if(templatesReferenced > 0) throw HttpStatusError.badRequest({message: `este pdf base aun esta siendo usado por ${templatesReferenced} plantillas`, type: ERROR_TYPES.ERROR})
    const base = await ModelFindById(Base, id)
    await Base.deleteOne({_id: base._id});
    io.emit('deleteBase', {id: base._id, madeBy: base.madeBy})
    res.json(base)  
})