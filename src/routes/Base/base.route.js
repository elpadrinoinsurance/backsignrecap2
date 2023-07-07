const express = require('express');
const router = express.Router();
const {
    get_base, 
    post_base, 
    get_base_id, 
    delete_base_id
} = require('./base.controller')
const { checkRol, 
        checkUser
} = require('../middleware')
const {roles} = require('../../database/constants');
const { paginationConfig } = require('../middleware/paginationConfig');

router.get('/', 
checkUser, 
checkRol(Object.keys(roles)),
paginationConfig,
get_base)

router.get('/:id', get_base_id)

router.post('/', 
checkUser, 
checkRol(Object.keys(roles)), 
post_base)

router.delete('/:id', 
checkUser, 
checkRol(Object.keys(roles)), 
delete_base_id)


module.exports = {
    baseRouter: router
}