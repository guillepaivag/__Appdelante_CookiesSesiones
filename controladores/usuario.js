const passport = require('passport')
const Usuario = require('../modelos/Usuario')

exports.postSignup = (req, res, next) => {
    const nuevoUsuario = new Usuario({
        email: req.body.email,
        name: req.body.name,
        password: req.body.password
    })

    Usuario.findOne({email: req.body.email}, (err, usuarioExistente) => {
        if(usuarioExistente) {
            return res.status(400).send('Ya existe el usuario.')
        }

        nuevoUsuario.save((err) => {
            if(err) {
                next(err)
            }

            req.logIn(nuevoUsuario, (err) => {
                if(err) {
                    next(err)
                }

                res.send('Usuario creado exitosamente como yo.')
            })
        })
    })
}

exports.postLogin = (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if(err) {
            next(err)
        }

        if(!user) {
            return res.status(400).send('Email o contraseña no validos')
        }

        req.logIn(user, (err) => {
            if(err) {
                next(err)
            }

            res.send('Login exitoso como yo.')
        })
    })(req, res, next)
}

exports.logout = (req, res) => {
    req.logout()
    res.send('Logout exitoso como yo.')
}