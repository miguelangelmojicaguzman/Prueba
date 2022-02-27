const Usuarios = require('../models/Usuarios');
const enviarEmail = require('../handlers/email');

exports.crearCuenta = (req, res) => {
    // res.send('crearCuenta');

    res.render('crearCuenta', 
    {
        nombrePag: 'Crear Cuenta'        
    });
};

exports.iniciarSesion = (req, res) => {
    // res.send('crearCuenta');
    console.log(res.locals.mensajes);

    const { error } = res.locals.mensajes;

    res.render('iniciarSesion', 
    {
        nombrePag: 'Iniciar Sesión',
        error        
    });
};

exports.nuevaCuenta = async (req, res) => {
    // console.log(req.body);

    const { email, password } = req.body;

    try {
        await Usuarios.create({
            email,
            password
        });

        //crear url de confirmar por correo
        const confirmarUrl = `http://${req.headers.host}/confirmar/${email}`;

        //crear el objeto de usuario para pasarlo con sus datos a la funcion de enviar correo
        const usuario = {
            email
        };        

        // enviar correo de confirmacion de creacion de cuenta de usuario
        await enviarEmail.enviar({
            usuario,
            subject: 'Confirma tu cuenta',
            confirmarUrl,
            archivo: 'confirmarCuenta' 
        });

        //redirigir al usuario
        req.flash('correcto', 'Se envió un mensaje a tu correo para confirmar tu cuenta');
        res.redirect('/iniciar-sesion');
        
    } catch (error) {
        // console.log(err);
        req.flash('error', err.errors.map(error => error.message)); //paso 4 (el paso 1, 2 y 3 están en el index)
        res.render('crearCuenta', {
            mensajes : req.flash(),            
            nombrePag: 'Crear Cuenta',
            email,
            password            
        });

    }

};

exports.reestablecerPass = (req, res) => {
    res.render('reestablecer', {
        nombrePag: 'Reestablecer Contraseña'
    });
};

exports.confirmarCuenta = async (req, res) => {
    console.log(req.params.correo);
    const usuario = await Usuarios.findOne({
        where: {
            email: req.params.correo
        }
    });

    if(!usuario){
        req.flash('error', 'NoVálido');
        res.redirect('/crear-cuenta');
    };

    // console.log(usuario);
   
    usuario.activo = '1'; 
    await usuario.save();                      

    req.flash('correcto', 'Tu cuenta ha sido activada')
    res.redirect('/iniciar-sesion');
};

