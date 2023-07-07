const express = require('express');
const router = express.Router();
const {resolve} = require('path')
const {
    login,
    logout,
    verifySession,
    firstLogin
} = require('./session.controller')
const {validateMiddleware} = require('../middleware')

router.post('/', validateMiddleware(require(resolve(__dirname, 'login.schema.json'))), firstLogin, login)
router.delete('/', logout)
router.get('/verify', verifySession)

module.exports = {
    sessionRouter: router
}