'use strict';

var nodemailer = require('nodemailer');
const Sequelize = require('sequelize');

const sequelize = new Sequelize('teatrodb', 'PortusN', '1234', {
    host: 'localhost',
    dialect: 'mysql',

    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },

    // SQLite only
    storage: 'path/to/database.sqlite',

    // http://docs.sequelizejs.com/manual/tutorial/querying.html#operators
    operatorsAliases: false
});



class  mailController {

    enviarCorreo(req, res) {
        var idRes;
        var nombreObra;
        var estreno;
        var lugar;
        var hora;
        var numBol;
        var correo;
        var total;
        var nombre;
        sequelize.query("select  reserva.idReserva,obra.nombre as obra, obra.fechaEstreno, obra.lugarEstreno ,obra.horaEstreno, persona.nombre as persona,reserva.numBoletos,(reserva.numBoletos*obra.precioBoleto) as total, cuenta.correo from reserva inner join cuenta on  reserva.exteral_idCuenta = cuenta.external_id  inner join persona on cuenta.id_persona = persona.idPersona  inner join obra on obra.idObra = reserva.id_obra  where CURDATE() = obra.fechaEstreno and reserva.estado = 1",
                {type: Sequelize.QueryTypes.SELECT}).then(function (reser) {
            console.log(JSON.stringify(reser));
            if (JSON.stringify(reser) == '[]') {
                console.log('No hay correo por enviar');
                res.redirect('/reservas');
            } else {
                console.log('Enviando Correos...');
                for (var i in reser) {
                    idRes = reser[i].idReserva;
                    nombreObra = reser[i].obra;
                    estreno = reser[i].fechaEstreno;
                    lugar = reser[i].lugarEstreno;
                    hora = reser[i].horaEstreno;
                    numBol = reser[i].numBoletos;
                    correo = reser[i].correo;
                    total = reser[i].total;
                    nombre = reser[i].persona;

                    var output = 'Hola ' + nombre + ' Te recordamos que hoy es el gran dia, tienes una reserva para la obra ' + nombreObra + ', es en el' + lugar + ' a las ' + hora + ' te esperamos, no faltes, ven y disfruta\n';
                    output = output + 'Usted tiene ' + numBol + ' boletos';

                    console.log(output);
                    console.log('su correo es -> ' + correo);
                    var transporter = nodemailer.createTransport({
                        service: 'gmail',
                        auth: {
                            user: 'paulcollaguazo95@gmail.com', // generated ethereal user
                            pass: 'gustavito2012'  // generated ethereal password
                        }
                    });

                    // setup email data with unicode symbols
                    var mailOptions = {
                        from: '"T E L I A" <paulcollaguazo95@gmail.com>', // sender address
                        to: correo, // list of receivers
                        subject: 'TELIA - Reserva ' + nombreObra + '', // Subject line
                        text: 'Hi baby ❤', // plain text body
                        html: output// html body
                    };

                    // send mail with defined transport object
                    transporter.sendMail(mailOptions, function (error, info) {
                        if (error) {
                            console.log(error);
                        } else {
                            console.log('Email enviado: ' + info.response);
                            res.redirect('/');
                        }
                    });
                }
            }
        });
    }
}
module.exports = mailController;