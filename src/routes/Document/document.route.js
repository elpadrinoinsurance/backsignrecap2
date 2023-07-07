const express = require('express');
const router = express.Router();
const { 
    get_documents, 
    post_document, 
    get_document_id,
    post_signature_document_id,
    delete_document_id,
    delete_all_documents,
    insert_batch_documents,
    download_documents
} = require('./document.controller')
const { 
    checkRol, 
    checkUser
} = require('../middleware')
const {roles} = require('../../database/constants');
const { paginationConfig } = require('../middleware/paginationConfig');

router.get('/download', 
checkUser, 
checkRol(Object.keys(roles)), 
download_documents)

router.get('/', 
checkUser, 
checkRol(Object.keys(roles)),
paginationConfig,
get_documents)

router.post('/batch', 
checkUser, 
checkRol(Object.keys(roles)), 
insert_batch_documents)

router.post('/', 
checkUser, 
checkRol(Object.keys(roles)), 
post_document)

router.get('/:id', get_document_id)

router.post('/:id', post_signature_document_id)

router.delete('/all',
checkUser,
checkRol(Object.keys(roles)),
delete_all_documents
)

router.delete('/:id', 
checkUser, 
checkRol(Object.keys(roles)), 
delete_document_id)

module.exports = {
    documentRouter: router
}