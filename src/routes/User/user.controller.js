const { controllerWrapper, ModelFindById, ModelUpdateById } = require('../../utils/common')
const User = require('../../database/models/User')
const Session = require('../../database/models/Session')
const { roles } = require('../../database/constants')
const { HttpStatusError } = require('../../Errors/http-status-error')

module.exports.get_accounts = controllerWrapper(async (req, res, next) => {
    const users = await User.paginate({ deletedAt: null }, req.pagination)
    res.json(users)
})

module.exports.get_account_id = controllerWrapper(async (req, res, next) => {
    const {id} = req.params
    const users = await ModelFindById(User, id, {filter: {deletedAt: null}})
    res.json(users)
})

module.exports.post_account = controllerWrapper(async (req,res,next) => {
    const { fullName, username, password } = req.body
    const user = new User({ fullName, username, password, rol: roles.OPERATIVO })
    await user.save();
    user.set('password', undefined, {strict: false})
    res.json(user)
})

module.exports.put_account = controllerWrapper(async (req,res,next) => {
    const { password, ...updateData } = req.body
    const userId = req.params.id
    if(password) updateData.password = password
    const options = {filter: {deletedAt: null}, selectFull: true}
    const user = await ModelUpdateById(User, userId, updateData, options)
    user.set('password', undefined, {strict: false})
    res.json(user)
})

module.exports.del_account = controllerWrapper(async (req,res,next) => {
    const {id} = req.params
    const user = req.user
    const delUser = await ModelFindById(User, id, {filter: {deletedAt: null}})
    if(delUser.equals(user._id)) throw HttpStatusError.badRequest({ message: "No puede eliminar su propio usuario"})
    if(delUser.rol === roles.ADMIN) throw HttpStatusError.badRequest({ message: "No se puede eliminar al admin"})
    await User.updateOne({_id: delUser._id}, {deletedAt: Date.now()})
    await Session.deleteMany({user: delUser._id})
    res.json(delUser)
})