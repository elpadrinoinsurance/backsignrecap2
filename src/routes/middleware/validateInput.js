const Ajv = require('ajv')
const { HttpStatusError } = require('../../Errors/http-status-error')
const { controllerWrapper } = require('../../utils/common')
const ajv = new Ajv({allErrors: true})
const addFormats = require('ajv-formats')
addFormats(ajv)

const validateMiddleware = (schema) => controllerWrapper(async (req, res, next) => {
    const {body, params, query, headers} = req
    const validate = ajv.compile(schema)
    const valid = validate({body, params, query, headers})
    if(!valid) throw HttpStatusError.badRequest({ message: errorFormatter(validate.errors)})
    next()
})

const validateResponseSchema = (schema) => {
  const validate = ajv.compile(schema)
  return (_req, res, next) => {
    res.json = (_super => {
      return function (data) {
        if(!validate(data)) throw HttpStatusError.badRequest({ message: errorFormatter(validate.errors)})
        return _super.call(this, data)
      }
    })(res.json)
    next()
  }
}

const errorFormatter = errors => {
    return errors.reduce((message, err) => {
        return `${message} ${err.instancePath.replace(/\//g, '')} ${err.message}`
    }, '').trim().replace(/\n/g, '')
}

module.exports = {
    validateMiddleware
}