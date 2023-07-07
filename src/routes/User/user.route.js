const express = require('express');
const router = express.Router();
const {
get_account_id,
get_accounts,
post_account,
del_account,
put_account
} = require('./user.controller')
const {
checkRol,
checkUser,
validateMiddleware
} = require('../middleware');
const { roles } = require('../../database/constants');
const { paginationConfig } = require('../middleware/paginationConfig');

router.get('/', checkUser, checkRol([roles.ADMIN]), paginationConfig, get_accounts)

router.get('/:id', checkUser, checkRol([roles.ADMIN]), get_account_id)

router.post('/', checkUser, checkRol([roles.ADMIN]), post_account)

router.put('/:id', checkUser, checkRol([roles.ADMIN]), put_account)

router.delete('/:id', checkUser, checkRol([roles.ADMIN]), del_account)

module.exports = {
    userRouter: router
}