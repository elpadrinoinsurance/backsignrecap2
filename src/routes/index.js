const express = require('express');
const router = express.Router();
const {templateRouter} = require('./Template/template.route')
const {baseRouter} = require('./Base/base.route')
const {documentRouter} = require('./Document/document.route')
const {sessionRouter} = require('./Session/session.route')
const {userRouter} = require('./User/user.route')

router.use('/base', baseRouter)
router.use('/template', templateRouter)
router.use('/document', documentRouter)
router.use('/session', sessionRouter)
router.use('/account', userRouter)

module.exports = {
    router
}