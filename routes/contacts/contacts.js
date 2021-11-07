const express = require('express')
const router = express.Router()
const {
    getContacts,
    getContact,
    saveContact,
    removeContact,
    updateContact,
    updateStatusFavorite } = require('../../controllers/contactsControllers')
const {
    validateContact,
    validateUpdateContact,
    validateId,
    validateStatusContact } = require('./validation')
const guard = require('../../helpers/guard')
const wrapError = require('../../helpers/errorHandler')

router.get('/', guard, wrapError(getContacts)) 

router.get('/:contactId', guard, validateId, wrapError(getContact))

router.post('/', guard, validateContact, wrapError(saveContact)) 

router.delete('/:contactId', guard, validateId, wrapError(removeContact)) 

router.put('/:contactId', guard, [validateId, validateUpdateContact], wrapError(updateContact))

router.patch(':contactId/favorite', guard, [validateId, validateStatusContact], wrapError(updateStatusFavorite))

module.exports = router
