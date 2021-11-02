const Contacts = require('../repository/index')

const getCats = async (req, res, next) => {
  try {
    const contacts = await Contacts.listContacts()
    res.json({ status: 'success', code: 200, data: { contacts } })
  } catch (error) {
    next(error)
  }
}

const getCat = async (req, res, next) => {
  try {
    const contact = await Contacts.getContactById(req.params.contactId)
    if (contact) {
      return res.status(200).json({ status: 'success', code: 200, data: { contact } })
    }
      return res.status(404).json({ status: 'error', code: 404, message: 'Not found' })

  } catch (error) {
    next(error)
  }
}


const saveCat = async (req, res, next) => {
  try {
    const contact = await Contacts.addContact(req.body)
    res.json({ status: 'success', code: 201, data: { contact } })
  } catch (error) {
    next(error)
  }
}

const removeCat = async (req, res, next) => {
  try {
    const contact = await Contacts.removeContact(req.params.contactId)
    if (contact) {
      return res.status(200).json({ status: 'success', code: 200, data: { contact } })
    }
      return res.status(404).json({ status: 'error', code: 404, message: 'Not found' })

  } catch (error) {
    next(error)
  }
}

const updateCat =  async (req, res, next) => {
  try {
    const contact = await Contacts.updateContact(req.params.contactId, req.body)
    if (contact) {
      return res.status(200).json({ status: 'success', code: 200, data: { contact } })
    }
      return res.status(404).json({ status: 'error', code: 404, message: 'Not found' })

  } catch (error) {
    next(error)
  }
}

const updateStatusFavorite =  async (req, res, next) => {
  try {
    const contact = await Contacts.updateContact(req.params.contactId, req.body)
    if (contact) {
      return res.status(200).json({ status: 'success', code: 200, data: { contact } })
    }
      return res.status(404).json({ status: 'error', code: 404, message: 'Not found' })

  } catch (error) {
    next(error)
  }
}

module.exports = {getCats, getCat, saveCat, removeCat, updateCat, updateStatusFavorite}