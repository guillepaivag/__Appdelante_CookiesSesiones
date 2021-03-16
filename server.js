const express = require('express')
const express_session = require('express-session')
const MongoStore = require('connect-mongo')(express_session)
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const passport = require('passport')
const passportConfig = require('./config/passport')

const app = express()

app.set('port', 3000)
const MONGO_URI = 'mongodb://127.0.0.1:27017/cookiesSession'

mongoose.Promise = global.Promise
mongoose.connect(MONGO_URI)
mongoose.connection.on('error', (err) => {
    throw err
    process.exit(1)
})

// const Usuario = require('./modelos/Usuario')
// const user = new Usuario({
//     email: 'jessicala182@gmail.com',
//     name: 'jessivanroses',
//     password: '123456'
// })
// user.save().then(() => {
//     console.log('usuario guardado')
// }).catch((err) => {
//     console.log(err)
// })

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(passport.initialize())
app.use(passport.session())
app.use(express_session({
    secret: 'ESTO ES SECRETO',
    resave: true,
    saveUninitialized: true,
    store: new MongoStore({
        url: MONGO_URI,
        autoReconnect: true
    })
}))

// app.get('/', (req, res) => {
//     req.session.cuenta = req.session.cuenta ? req.session.cuenta + 1 : 1
//     res.send(`Hola! Total de veces visitadas: ${req.session.cuenta}`)
// })

const controladorUsuario = require('./controladores/usuario')
app.post('/signup', controladorUsuario.postSignup)
app.post('/login', controladorUsuario.postLogin)
app.get('/logout', passportConfig.estaAutenticado, controladorUsuario.logout)
app.get('/usuarioInfo', passportConfig.estaAutenticado, (req, res) => {
    res.json(req.user)
})

app.listen(app.get('port'), () => {
    console.log(`http://localhost:${app.get('port')}`)
})