const express = require('express')
const router = express.Router()
const {getCats, getCat, saveCat, removeCat, updateCat, updateStatusFavorite} = require('../../controllers/catsControllers')
const {validateContact, validateUpdateContact, validateId, validateStatusContact} = require('./validation')

router.get('/', getCats) 

router.get('/:contactId', validateId, getCat)

router.post('/', validateContact, saveCat) 

router.delete('/:contactId', validateId, removeCat) 

router.put('/:contactId', [validateId, validateUpdateContact], updateCat)

router.patch(':contactId/favorite', [validateId, validateStatusContact], updateStatusFavorite) 

module.exports = router
