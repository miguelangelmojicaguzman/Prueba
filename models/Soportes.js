const Sequelize = require('sequelize');
const db = require('../config/db');
const slug = require('slug');
const shortid = require('shortid');

const Soportes = db.define('soportes', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: Sequelize.STRING(100),     
    url: Sequelize.STRING(100),
    usuarioId: Sequelize.INTEGER
}, {
    hooks: { //los hooks corren una funcion en determinado tiempo
        beforeCreate(soporte) { //se ejecuta antes de insertar en la BD. Recibe un objeto con los datos antes de insertarlos
            const url = slug(soporte.nombre).toLowerCase();
            soporte.url = `${url}-${shortid.generate()}`;

            // console.log(soporte.usuarioId);
        }
    } 

});

module.exports = Soportes;