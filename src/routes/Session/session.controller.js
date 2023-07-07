const Session = require('../../database/models/Session')
const User = require('../../database/models/User')
const { controllerWrapper, verifyPassword } = require('../../utils/common')
const uuid = require('uuid')
const { HttpStatusError } = require('../../Errors/http-status-error')
const {isSessionActive} = require('./session.helper')
const { roles } = require('../../database/constants')

module.exports.firstLogin = controllerWrapper(async (req, res, next) => {
    const existUsers = await User.count()
    if(existUsers > 0) return next()
    const { username, password } = req.body
    const user = new User({ fullName: "administrador", username, password, rol: roles.ADMIN })
    await user.save();
    req.username = username
    req.password = password
    next()
})

module.exports.login = controllerWrapper(async (req, res, next) => {
    const {username, password} = req.body
    const user = await User.findOne({username, deletedAt: null}).select('password rol')
    if(!user) throw HttpStatusError.unauthorize({message: "credenciales incorrectas"})
    const isValidPass = await verifyPassword(password, user.password)
    if(!isValidPass) throw HttpStatusError.unauthorize({message: "credenciales incorrectas"})

    const sessionId = uuid.v4()
    const session = new Session({ session: sessionId, user: user._id })
    await session.save();
    res.json({session, rol: user.rol})
})

module.exports.logout = controllerWrapper(async (req, res, next) => {
    const sessionId = req.get('auth')
    const resp = await Session.deleteOne({session: sessionId});
    res.json(resp)
})

module.exports.verifySession = controllerWrapper(async (req, res, next) => {
    const sessionId = req.get('auth')
    const isActive = await isSessionActive(sessionId)
    res.json({ session: isActive })
})