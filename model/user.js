const { Schema, model } = require('mongoose')
const gravatar = require('gravatar')
const crypto = require('crypto')
const { Subscription } = require('../config/constants')
const bcrypt = require('bcryptjs')

const SALT_FACTOR = 6

const userSchema = new Schema({
    name: { type: String, default: "Guest" },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        validate(value) {
            const re = /\S+@\S+.\S+/;
            return re.test(String(value).toLowerCase());
        }
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
    },
    subscription: {
        type: String,
        enum: {
            values: [Subscription.STARTER, Subscription.PRO, Subscription.BUSINESS],
        },
        default: Subscription.STARTER,
    },
    token: {
        type: String,
        default: null,
    },
    avatar: {
        type: String,
        default: function () {
            return gravatar.url(this.email, { s: '250'}, true)
        }
    },
    idUserCloud: { type: String, default: null },
    isVerified: { type: Boolean, default: false },
    verifyToken: {
        type: String,
        required: true,
        default: crypto.randomUUID(),
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

userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        const salt = await bcrypt.genSalt(SALT_FACTOR)
        this.password = await bcrypt.hash(this.password, salt)
    }
    next()
})

userSchema.methods.isValidPassword = async function (password) {
    return bcrypt.compare(password, this.password)
}

const User = model('user', userSchema)
 
module.exports = User