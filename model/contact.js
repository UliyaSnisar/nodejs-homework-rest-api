const { Schema, model } = require('mongoose')
const {ValidLengthOfContactName} = require('../config/constant')

const contactSchema = new Schema({
    name: {
        type: String,
        minLength: ValidLengthOfContactName.MIN_LENGTH_OF_NAME,
        maxLength: ValidLengthOfContactName.MAX_LENGTH_OF_NAME,
        required: [true, 'Set name for contact'],
    },
    email: {
        type: String,
        required: [true, "Set email for contact"],
        unique: true,
    },
    phone: {
        type: String,
        required: [true, "Set phone for contact"],
        unique: true,
    },
    favorite: {
        type: Boolean,
        default: false,
    },
},
    {
        versionKey: false,
        timestamps: true,
        toJSON: {
            virtuals: true, transform: function (doc, ret) {
                delete ret._id
                return ret
            }
        },
        toObject: { virtuals: true },
    }
)

contactSchema.virtual("fullname").get(function () {
  return `${this.name} ${this.surname}`;
});

const Contact = model('contact', contactSchema)
 
module.exports = Contact
