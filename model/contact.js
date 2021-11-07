const { Schema, model, SchemaTypes } = require('mongoose')
const { ValidLengthOfContactName } = require('../config/constants')
const mongoosePaginate = require('mongoose-paginate-v2')

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
    owner: {
        type: SchemaTypes.ObjectId,
        ref: 'user',
    }
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
  return `${this.name}`;
});

contactSchema.plugin(mongoosePaginate);

const Contact = model('contact', contactSchema)
 
module.exports = Contact
