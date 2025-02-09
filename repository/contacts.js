const Contact = require('../model/contact')

const listContacts = async (userId, query) => {
  // const results = await Contact.find({owner: userId}).populate({
  //   path: 'owner',
  //   select: 'email subscription createdAt updatedAt'
  // })

  const {
    sortBy,
    sortByDesc,
    filter,
    favorite = null,
    limit = 5,
    offset = 0 } = query
  
  const searchOptions = { owner: userId }

  if (favorite !== null) {
    searchOptions.favorite = favorite
  }

  const results = await Contact.paginate(searchOptions, {
    limit,
    offset,
    sort: {
      ...(sortBy ? { [`${sortBy}`]: 1 } : {}),
      ...(sortByDesc ? { [`${sortByDesc}`]: -1 } : {}),
    },
    select: filter ? filter.split('|').join(' ') : '',
    populate: {
      path: 'owner',
      select: 'name email subscription'
    }
  })
  const { docs: contacts } = results
  delete results.docs
  return {...results, contacts}
}

const getContactById = async (contactId, userId) => {
  return await Contact.findOne({ _id: contactId, owner: userId }).populate({
    path: 'owner',
    select: 'email subscription createdAt updatedAt'
  })
}

const removeContact = async (contactId, userId) => {
  return await Contact.findOneAndRemove({_id: contactId, owner: userId})
}

const addContact = async (body) => {
  return await Contact.create(body)
}

const updateContact = async (contactId, body, userId) => {
  return await Contact.findOneAndUpdate(
    {_id: contactId, owner: userId},
    { ...body },
    {new: true},
  )
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
}
