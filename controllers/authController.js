const passport = require('passport');
const Usuario = require('../models/Usuarios');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const crypto = require('crypto'); // permite generar un token
const bcrypt = require('bcrypt-nodejs');
const enviarEmail = require('../handlers/email');

exports.autenticarUsuario = passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/iniciar-sesion',
    failureFlash: true,
    badRequestMessage: 'Debe ingresar Email y Password'
});

// funcion para vevisar si el usuario esta logueado
exports.usuarioAutenticado = (req, res, next) => {
    if(req.isAuthenticated()){
        return next();
    }
    // si no esta autenticado
    return res.redirect('/iniciar-sesion');
}

exports.cerrarSesion = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/iniciar-sesion');
    });
};

exports.enviarToken = async (req, res) => {
    // console.log(req.body.email);
    const email = req.body.email;    
    const usuario = await Usuario.findOne({ where: { email } } );
    // console.log(usuario);
    if(!usuario){        
        req.flash('error', 'Email no está registrado');
        // console.log(res.locals.mensajes);
        res.redirect('/reestablecer');
    };

    usuario.token = crypto.randomBytes(20).toString('hex'); //genera token
    usuario.expiracion = Date.now() + 3600000; // expira en 1 hora

    await usuario.save();

    const resetUrl = `http://${req.headers.host}/reestablecer/${usuario.token}`;
    // console.log(resetUrl); 
    
    //envia el correo con el token
    await enviarEmail.enviar({
        usuario,
        subject: 'Password Reset',
        resetUrl,
        archivo: 'reestablecerPass' 
    });

    //terminar la ejecucion con res.redirect
    req.flash('correcto', 'Se envió un mensaje a tu correo');
    res.redirect('/iniciar-sesion');
};

exports.validarToken = async (req, res) => { 
    console.log(req.params.token);   
    const usuario = await Usuario.findOne({
        where: {
            token:  req.params.token
        }
    });

    if(!usuario){
        req.flash('error', 'No válido');
        res.redirect('/reestablecer');
    };

    res.render('resetPass', {
        nombrePag: 'Reestablecer Contraseña'
    });

};

exports.actualizarPass = async (req, res) => {
    const usuario = await Usuario.findOne({
        where: {
            token: req.params.token,
            expiracion: {
                //revisar operador de sequelize
                [Op.gte] : Date.now()

            }
        }
    });

    if(!usuario){
        req.flash('error', 'No válido');
        res.redirect('/reestablecer');
    };

    usuario.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));           
    usuario.token = null;
    usuario.expiracion = null;
   
    await usuario.save();

    req.flash('correcto', 'Tu contraseña se ha modificado correctamente')
    res.redirect('/iniciar-sesion');

        
};