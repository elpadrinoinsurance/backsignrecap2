const { ERROR_CODES, ERROR_TYPES } = require("../../Errors/constants")

const errorHandler = (err, req, res, next) => {
    if(res.headersSent) {
        return next(err)
    }
    console.error(err)
    if(err.name === 'ValidationError'){
        let errors = ""
        Object.keys(err.errors).forEach((key) => {
          errors += `${key}: ${err.errors[key].message} `;
        });
        res.status(ERROR_CODES.UNPROCESSABLE_ENTITY)
        res.json({
            status: ERROR_CODES.UNPROCESSABLE_ENTITY,
            type: ERROR_TYPES.ERROR,
            message: errors
        })
    }
    else{
        res.status(err.code)
        res.json({
            status: err.code,
            type: err.type,
            message: err.message
        })
    }
}

module.exports = {
    errorHandler
}