const nodemailer = require('nodemailer');
const pug = require('pug');
const juice = require('juice');
const htmlToText = require('html-to-text');
const util = require('util');
const emailConfig = require('../config/email');

let transport = nodemailer.createTransport({
    host: emailConfig.host,
    port: emailConfig.port,
    auth: {
      user: emailConfig.user,
      pass: emailConfig.pass
    }
});

//generar HTML
const generarHTML = (archivo, opciones = {}) => { // por defecto el parametro opciones será un objeto vacio ({})
    const html = pug.renderFile(`${__dirname}/../views/emails/${archivo}.pug`, opciones);
    return juice(html);
};

exports.enviar = async (opciones) => {
    const html = generarHTML(opciones.archivo, opciones);
    const text = htmlToText.fromString(html);
    let optionsEmail = {
        from: 'WXManager <no-reply@wxmanager.com>',
        to: opciones.usuario.email,
        subject: opciones.subject,
        text,
        html 
    };

    const enviarEmail = util.promisify(transport.sendMail, transport); //util entre muchas otras cosas permite a funciones que no soporta promesas, soportarlas
    return enviarEmail.call(transport, optionsEmail);
};