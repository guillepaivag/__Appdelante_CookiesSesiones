const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const Usuario = require('../modelos/Usuario')

passport.serializeUser((user, done) => {
    done(null, user._id)
})

passport.deserializeUser((id, done) => {
    Usuario.findById(id, (err, user) => {
        done(err, user)
    })
})

passport.use(new LocalStrategy({usernameField: 'email'}, (email, password, done) => {
    Usuario.findOne({email}, (err, user) => {
        if(!user){
            return done(null, false, {message: `${email} no esta registrado. :(`})
        }

        user.compararPassword(password, (err, sonIguales) => {
            if(sonIguales){
                return done(null, user)
            }

            return done(null, false, {
                message: 'La contraseña no es valida. :('
            })
        })
    })
}))

exports.estaAutenticado = (req, res, next) => {
    if(req.isAuthenticated()) {
        return next()
    }

    res.status(401).send('Tienes que hacer login para ver el contenido. :D')
}