const { ERROR_CODES, ERROR_TYPES } = require('./constants')

class HttpStatusError extends Error {
    constructor(
        code,
        type,
        message
    ) {
        super(message)
        this.code = code
        this.type = type
    }

    static notFound({message}) {
        return new HttpStatusError(ERROR_CODES.NOT_FOUND, ERROR_TYPES.ERROR, message)
    }

    static badRequest ({message, type}) {
        return new HttpStatusError(ERROR_CODES.BAD_REQUEST, type, message)
    }

    static unauthorize ({message, type=ERROR_TYPES.ERROR}) {
        return new HttpStatusError(ERROR_CODES.UNAUTHORIZED, type, message)
    }

    static internalServerError ({message, type}) {
        return new HttpStatusError(ERROR_CODES.INTERNAL_SERVER_ERROR, type, message)
    }

    static unprocesableEntity ({message, type}) {
        return new HttpStatusError(ERROR_CODES.UNPROCESSABLE_ENTITY, type, message)
    }
}

module.exports = {
    HttpStatusError
}