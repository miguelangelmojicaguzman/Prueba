const Sequelize = require('sequelize');
const db = require('../config/db');
const Soportes = require('./Soportes');
const bcrypt = require('bcrypt-nodejs');

const Usuarios = db.define('usuarios', { //el primer parametro es el nombre del modelo en este caso "usuarios"
    id:{
        type: Sequelize.INTEGER(11),
        primaryKey: true,
        autoIncrement: true
    },
    email:{
        type: Sequelize.STRING(60),
        allowNull: false,
        validate: { // revisar documentacion de Sequelize para las validaciones
            isEmail: {
                msg: 'Agrega un email válido'
            },
            notEmpty: {
                msg: 'Debe agregar un email'
            }
        },
        unique: {
            args: true,
            msg: 'Usuario ya registrado'            
        }
    },
    password: {
        type: Sequelize.STRING(60),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Debe agregar un password'
            }
        }
    },
    activo: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0        
    },
    token: Sequelize.STRING,
    expiracion: Sequelize.DATE
}, {
    hooks: { //los hooks corren una funcion en determinado tiempo
        beforeCreate(usuario) { //se ejecuta antes de insertar en la BD. Recibe un objeto con los datos antes de insertarlos
            usuario.password = bcrypt.hashSync(usuario.password, bcrypt.genSaltSync(10));           
        }
    } 
});

Usuarios.prototype.verificarPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
}; //prototype quiere decir que todos los objetos creados de Usuarios van a tener esa funcion

Usuarios.hasMany(Soportes); //para relacionarlo con la tabla de proyectos. hasMany porque es de 1 a muchos (1 usuario puede crear muchos proyectos)

module.exports = Usuarios;

