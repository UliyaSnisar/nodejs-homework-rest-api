const jwt = require('jsonwebtoken')
const fs = require('fs/promises')
// const path = require('path')
// const mkdirp = require('mkdirp')
const Users = require('../repository/users')
// const UploadService = require('../services/file-upload')
const UploadService = require('../services/cloud-upload')
const { HttpCode, Subscription } = require('../config/constants')
require('dotenv').config()
const { CustomError } = require('../helpers/customError');
const SECRET_KEY = process.env.JWT_SECRET_KEY


const signup = async (req, res, next) => {
    const { email, password, subscription } = req.body
    const user = await Users.findByEmail(email)
    if (user) {
        return res.status(HttpCode.CONFLICT).json({
                status: 'error',
                code: HttpCode.CONFLICT,
                message: 'Email is already used',
        })
    }
    try {
        const newUser = await Users.create({ email, password, subscription })
        return res.status(HttpCode.CREATED).json({
                status: 'success',
                code: HttpCode.CREATED,
                data: {
                    id: newUser.id,
                    email: newUser.email,
                    subscription: newUser.subscription,
                    avatar: newUser.avatarUrl,
                },
            })
    } catch (error) {
        next(error)
    }
}

const login = async (req, res, _next) => {
    const { email, password } = req.body
    const user = await Users.findByEmail(email)
    const isValidPassword = await user?.isValidPassword(password)

        if (!user || !isValidPassword) {
        return res.status(HttpCode.UNAUTHORIZED).json({
                status: 'error',
                code: HttpCode.UNAUTHORIZED,
                message: 'Invalid credentials',
        })
    }

    const id = user._id
    const payload = { id }
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' })
    await Users.updateToken(id, token)

    return res.status(HttpCode.OK).json({
    status: "success",
    code: HttpCode.OK,
    data: {token},
  });
}

const logout = async (req, res, _next) => {
    const id = req.user._id
    await Users.updateToken(id, null)
    return res.status(HttpCode.NO_CONTENT).json({})
}

const current = async (req, res, next) => {
    try {
        const { email, subscription } = req.user
        
        return res.status(HttpCode.OK).json({
            status: 'success',
            code: HttpCode.OK,
            data: {
                email,
                subscription
            }
        })
    } catch (error) {
        next(error)
    }
}

const updateSubscription = async (req, res) => {
    const userId = req.user._id
    const user = await Users.updateSubscription(req.body, userId)
    if (user) {
        return res.status(HttpCode.OK).json({
            status: 'success',
            code: HttpCode.OK,
            user: {
                id: user.userId,
                email: user.email,
                subscription: user.subscription,
            }
        })
    }
    throw new CustomError(HttpCode.NOT_FOUND, 'Not found')
}

const userStarter = async (req, res) => {
    return res.status(HttpCode.OK).json({
        status: 'success',
        code: HttpCode.OK,
        data: {
            message: `Only for ${Subscription.STARTER}`,
        }
    })
}

const userPro = async (req, res) => {
    return res.status(HttpCode.OK).json({
        status: 'success',
        code: HttpCode.OK,
        data: {
            message: `Only for ${Subscription.PRO}`,
        }
    })
}

const userBusiness = async (req, res) => {
    return res.status(HttpCode.OK).json({
        status: 'success',
        code: HttpCode.OK,
        data: {
            message: `Only for ${Subscription.BUSINESS}`,
        }
    })
}

// Using local storage
// const uploadAvatar = async (req, res, next) => {
//     const id = String(req.user._id)
//     const file = req.file
//     const AVATAR_OF_USERS = process.env.AVATAR_OF_USERS
//     const destination = path.join(AVATAR_OF_USERS, id)
//     await mkdirp(destination)
//     const uploadService = new UploadService(destination)
//     const avatarUrl = await uploadService.save(file, id)
//     await Users.updateAvatar(id, avatarUrl)

//     return res.status(HttpCode.NO_CONTENT).json({
//         status: 'success',
//         code: HttpCode.OK,
//         data: {avatarUrl},
//     })
// }

// Using cloud storage

const uploadAvatar = async (req, res, next) => {
    const {id, idUserCloud} = req.user
    const file = req.file

    const destination = 'avatars'
    const uploadService = new UploadService(destination)
    const {avatarUrl, retunrIdUserCloud} = await uploadService.save(file.path, idUserCloud)
    await Users.updateAvatar(id, avatarUrl, retunrIdUserCloud)

    try {
        await fs.unlink(file.path)
    } catch (error) {
        console.log(error.message);
    }

    return res.status(HttpCode.NO_CONTENT).json({
        status: 'success',
        code: HttpCode.OK,
        data: {avatar: avatarUrl},
    })
}

module.exports = {
    signup,
    login,
    logout,
    current,
    updateSubscription,
    userStarter,
    userPro,
    userBusiness,
    uploadAvatar,
}