const { updateContact } = require('../controllers/contactsControllers')
const Contacts = require('../repository/contacts')
const {CustomError} = require('../helpers/customError')

jest.mock('../repository/contacts')

describe('Unit test controller updateContact', function () {
    let req, res

    beforeEach(() => {
        Contacts.updateContact = jest.fn()
        req = {params: {id: 3}, body: {}, user: {_id: 1}}
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(data => data)
        }
    })

    it('Contact exist', async () => {
        const contact = {
            id: 3,
            name: 'Simon',
            email: 'test@mail.com',
            phone: '1234567890'
        }
        Contacts.updateContact = jest.fn(() => {
            return contact
        })
        const result = await updateContact(req, res)
        expect(result).toBeDefined()
        expect(result).toHaveProperty('status')
        expect(result).toHaveProperty('code')
        expect(result).toHaveProperty('data')
        expect(result.data.contact).toEqual(contact)
    });

    it('Cat not exist v.1.0', async () => {
        await expect(updateContact(req, res)).rejects.toEqual(
            new CustomError(404, 'Not found'),
        )
    })

    it("Contact not exist v.1.1", () => {
        return updateContact(req, res).catch((e) => {
            expect(e.status).toEqual(404)
            expect(e.message).toEqual("Not found")
        })
    })
})