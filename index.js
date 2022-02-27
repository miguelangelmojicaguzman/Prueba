const express = require('express');
const routes = require('./routes');
const path = require('path'); //libreria que permite acceder a los archivos del proyecto
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash'); //paso 1
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('./config/passport');

// extraer variables de variables.env
require('dotenv').config({ path: 'variables.env'});

//helpers (funciones globales)
const helpers = require('./helpers');

// crear conexon a la BD
const db = require('./config/db');

//importar el modelo a crear en la BD
require('./models/Usuarios');
require('./models/Soportes');
require('./models/Avances');

db.sync().then(() => console.log('Conectado')) //sequeliza trabaja con promersas por eso se usa then (then resuelve la promesa)
         .catch(err => console.log(err));

// crear servidor express
const app = express();

//archivos estaticos
app.use(express.static('public'));

// habilitar pug (pug es una motor de plantilla )
app.set('view engine', 'pug');

//habilitar bodyParser para leer datos del formulario
app.use(bodyParser.urlencoded({extended: true}));


//agregamos express validator a toda la app
app.use(expressValidator());


// añadir la carpeta de los vistas
app.set('views', path.join(__dirname, './views')); //directorio ppal

//agregar flash messages
app.use(flash()); //paso 2

app.use(cookieParser());

//session nos permite navegar entre paginas sin volvernos a autenticar
app.use(session({
    secret: 'supersecreto',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());


//pasar vardump a la app
app.use((req, res, next) => {
    // res.locals.year = new Date().getFullYear();    
    res.locals.vardump = helpers.vardump;
    res.locals.mensajes = req.flash(); //F
    // console.log(req.user);
    res.locals.usuario = {...req.user} || null;
    // console.log(res.locals.usuario);

    next();
});


//rutas
app.use('/', routes() );

//servidor y puerto
const host = process.env.HOST || '0.0.0.0'; //Cuando se suba a herocu no va a existir la variable process.env.HOST y va a leer '0.0.0' va a encontrar que esa ip no es valida y pondra una dispoble valida
const port = process.env.PORT || 3000; //aqui es al reves process.env.PORT será el puerto que asige herocu, para local será 3000

app.listen(port, host, () => {
    console.log('El servidor está en ejecución');
})

// require('./handlers/email'); solo para probar el envio del correo cada vez que se inicia la app

