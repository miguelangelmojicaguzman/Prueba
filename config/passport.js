const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

//referencia al model donde vamos a autenticar
const Usuarios = require('../models/Usuarios');

// local strategy - login con credenciales propios (email y password)
passport.use(
    new LocalStrategy(
        {
            usernameField: 'email', // 'email' y 'password' deben ser tal cual como estan el modelo
            passwordField: 'password'
        },
        async (email, password, done) => {
            try {
                const usuario = await Usuarios.findOne({
                    where: { 
                        email,
                        activo: 1 
                    }
                });
                
                //el usuario existe, ahora compara password
                if(!usuario.verificarPassword(password)){
                    return done(null, false, {
                        message: 'Password Incorrecto'
                    }) 
                }
                // email y pass correctos
                return done(null, usuario);

            } catch (error) {
                // el usuario no existe
                return done(null, false, {
                    message: 'La cuenta de usuario no existe'
                })                
            }

        }
    )
);

// serializar el objeto usuario para acceder sus valores
passport.serializeUser((usuario, callback) => {
    callback(null, usuario);
});

// deserializar el objeto usuario
passport.deserializeUser((usuario, callback) => {
    callback(null, usuario);
});

module.exports = passport;