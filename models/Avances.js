const Sequelize = require('sequelize');
const db = require('../config/db');

const Soportes = require('./Soportes');

const Avances = db.define('avances', {
    id: {
        type: Sequelize.INTEGER(11),
        primaryKey: true,
        autoIncrement: true
    },
    avance: Sequelize.STRING(100),
    estado: Sequelize.INTEGER(1)
});

Avances.belongsTo(Soportes);

module.exports = Avances;

