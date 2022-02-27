const express = require('express');
const router = express.Router();

//importar expressvalidator 
const { body } = require('express-validator/check');

//importamos el controlador
const soporteController = require('../controllers/soporteController');
const avanceController = require('../controllers/avanceController');
const usuariosController = require('../controllers/usuariosController');
const authController = require('../controllers/authController');


module.exports = function() {

    router.get('/', 
        authController.usuarioAutenticado,
        soporteController.soportesHome
    );   

    router.get('/nuevo-soporte', 
        authController.usuarioAutenticado,
        soporteController.nuevoSoporte
    );   

    router.post('/nuevo-soporte/:id', 
        authController.usuarioAutenticado,
        body('nombre').not().isEmpty().trim().escape(),
        soporteController.creaYeditaSoporte
    );   

    router.get('/soportes/:url', 
        authController.usuarioAutenticado,
        soporteController.soporteURL
    ); 

    router.get('/soportes/editar/:id', 
        authController.usuarioAutenticado,
        soporteController.editarSoporte
    ); 

    router.delete('/soportes/:url', 
        authController.usuarioAutenticado,
        soporteController.eliminarSoporte
    );

    //rutas avances del soporte
    router.post('/soportes/:url', 
        authController.usuarioAutenticado,  
        avanceController.agregarAvance
    );

    router.patch('/avances/:id', 
        authController.usuarioAutenticado,
        avanceController.cambiarEstado
    ); //patch es similar a put (de axion), pero patch solo cambia una parte de los datos y aqui solo queremos cambiar el campo estado

    router.delete('/avances/:id', 
        authController.usuarioAutenticado,
        avanceController.eliminarAvance
    ); //patch es similar a put (de axion), pero patch solo cambia una parte de los datos y aqui solo queremos cambiar el campo estado

    //rutas cuenta de usuarios
    router.get('/soportes/editar/:id', 
        authController.usuarioAutenticado,
        soporteController.editarSoporte
    ); 

    router.get('/crear-cuenta', usuariosController.crearCuenta);
    router.post('/crear-cuenta', usuariosController.nuevaCuenta);    
    router.get('/confirmar/:correo', usuariosController.confirmarCuenta);
    
    router.get('/iniciar-sesion', usuariosController.iniciarSesion);
    router.post('/iniciar-sesion', authController.autenticarUsuario);

    router.get('/cerrar-sesion', authController.cerrarSesion);
    
    router.get('/reestablecer', usuariosController.reestablecerPass);
    router.post('/reestablecer', authController.enviarToken);
    router.get('/reestablecer/:token', authController.validarToken);
    router.post('/reestablecer/:token', authController.actualizarPass);


    return router;
    
};