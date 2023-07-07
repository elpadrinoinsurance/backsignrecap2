const { HttpStatusError } = require('../../Errors/http-status-error')
const { controllerWrapper } = require('../../utils/common')
const {isSessionActive} = require('../Session/session.helper')

const sessionMiddleware = controllerWrapper(async (req, res, next) => {
    const sessionId = req.get('auth')
    const isActive = await isSessionActive(sessionId)
    if(isActive){
        next()
    }
    else{
        throw HttpStatusError.unauthorize({message: "sesion invalida"})
    }
})

module.exports = {
    sessionMiddleware
}