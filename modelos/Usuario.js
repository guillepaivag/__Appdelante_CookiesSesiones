const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcrypt-nodejs')

const usuarioSchema = new Schema({
    email: {
        type: String,
        unique: true,
        lowercase: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})

usuarioSchema.pre('save', function(next){
    const userInfo = this

    if(!userInfo.isModified('password')){
        return next()
    }

    bcrypt.genSalt(10, (err, salt) => {
        if(err){
            next(err)
        }

        bcrypt.hash(userInfo.password, salt, null, (err, hash) => {
            if(err){
                next(err)
            }

            userInfo.password = hash
            next()
        })
    })
})

usuarioSchema.methods.compararPassword = function (password, cb) {
    bcrypt.compare(password, this.password, (err, sonIguales) => {
        if(err){
            return cb(err)
        }

        cb(null, sonIguales)
    })
}

module.exports = mongoose.model('Usuario', usuarioSchema)