const { HttpStatusError } = require("../../Errors/http-status-error")
const { controllerWrapper } = require("../../utils/common")

const checkRol = (roles) => controllerWrapper((req, res, next) => {
  const user = req.user
  const hasPermission = roles.some(rol => rol === user.rol)
  if(!hasPermission) throw HttpStatusError.unauthorize({message: "No tienes los permisos requeridos"})
  next()
})

module.exports = {
  checkRol
}