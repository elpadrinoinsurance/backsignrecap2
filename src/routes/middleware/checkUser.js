const Session = require('../../database/models/Session')
const User = require('../../database/models/User')
const { HttpStatusError } = require('../../Errors/http-status-error')
const { controllerWrapper, ModelFindById } = require('../../utils/common')
const { DAY, MAX_TIME_DAYS } = require('../../database/constants')

const checkUser = controllerWrapper(async (req, res, next) => {
  const sessionId = req.get('auth')
  const session = await Session.findOne({session: sessionId})
  if(!session) throw HttpStatusError.unauthorize({message: "sesion invalida"})
  
  const now = Date.now()
  const diffDays = Math.round(Math.abs((session.createdAt - now) / DAY))
  if(diffDays > MAX_TIME_DAYS){
    await Session.deleteOne({session: sessionId})
    throw HttpStatusError.unauthorize({message: "sesion expirada"})
  }

  const user = await ModelFindById(User, session.user, {filter: {deletedAt: null}})
  if(!user) throw HttpStatusError.unauthorize({message: "usuario invalido"})

  req.user = user
  next()
})

module.exports = {
  checkUser
}