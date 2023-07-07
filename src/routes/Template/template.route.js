const express = require('express');
const router = express.Router();
const { 
    get_template, 
    post_template, 
    get_template_id,
    delete_template_id
} = require('./template.controller')
const { checkRol, 
        checkUser 
} = require('../middleware')
const {roles} = require('../../database/constants');
const { paginationConfig } = require('../middleware/paginationConfig');

router.get('/',
checkUser, 
checkRol(Object.keys(roles)), 
paginationConfig,
get_template)

router.post('/', 
checkUser, 
checkRol(Object.keys(roles)), 
post_template)

router.get('/:id', get_template_id)

router.delete('/:id', 
checkUser, 
checkRol(Object.keys(roles)), 
delete_template_id)


module.exports = {
    templateRouter: router
}