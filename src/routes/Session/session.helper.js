const { ModelFind } = require('../../utils/common')

const Session = require('../../database/models/Session')


const isSessionActive = async (sessionId) => {
    const session = await ModelFind(Session, 'session', sessionId)
    return session.length > 0 ? true:false
}

module.exports = {
    isSessionActive
}