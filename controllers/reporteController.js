'use strict';
const uuidv4 = require('uuid/v4');
var pdf = require('html-pdf');
const Sequelize = require('sequelize');
var fs = require('fs');
var x = 0;
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

class reporte {
    crearPDF(req, res) {
        var idRes = req.params.external;
        console.log('====================');
        console.log(idRes);
        console.log('====================');
        sequelize.query("select obra.nombre as obra, persona.nombre as persona, obra.fechaEstreno,\n\
 reserva.fechasRetiroBoletos, reserva.numBoletos,\n\
 obra.precioBoleto, reserva.numBoletos*obra.precioBoleto as total from reserva inner join cuenta on  reserva.exteral_idCuenta = cuenta.external_id \n\
inner join persona on cuenta.id_persona = persona.idPersona \n\
inner join obra on obra.idObra = reserva.id_obra \n\
where CURDATE() <= DATE_ADD(obra.fechaEstreno, INTERVAL 1 DAY) and reserva.external_id = ?",
                {replacements: [idRes], type: sequelize.QueryTypes.SELECT}).then(function (reser) {
            if (reser) {
                for (var i in reser) {
                    var nombre = reser[i].persona;
                    var obra = reser[i].obra;
                    var numBol = reser[i].numBoletos;
                    var retiro = reser[i].fechasRetiroBoletos;
                    var reservado = reser[i].fechaEstreno;
                    var precioBol = reser[i].precioBoleto;
                    var total = reser[i].total;
                }
                var options = {
                    "format": 'A4',
                    "header": {
                        "height": "100px"
                    },
                    "footer": {
                        "height": "100px"
                    },
                    "base": '/home/samypaul/Desktop/'
                };
                var contenido = '<div id="pageHeader" style=" padding.left:100px; border-bottom: 1px solid #ddd; padding-bottom: 5px;"><h3 style="color: #E5702D; font-size: 20px">TEATRO LABORATORIO E INVESTIVACION ACTORAL</h3></div>\n\
            <div style="font-size: 15px;width: 80%;padding-left: 50px; padding-right: 50px"><p>Hola' + nombre + ' </p><p>TELIA te ofrece los mas cordiales saludos, por parte de su director, actores y todo el equipo que conforma TELIA.<br>\n\
                    Es un gusto saber que eres parte del publico que disfruta y valora el arte dentro de la ciudad de Loja y que además lo apoya.\n\
                </p>\n\
                <p>\n\
                    Sin más preambulos, agradecemos la reserva que realizaste con la siguiente informacion:\n\
                </p>\n\
                <table style="width:110%; font-size: 10px; border:1px solid black; text-aling: center">\n\
                    <thead>\n\
                        <tr>\n\
                            <th>Obra</th>\n\
                            <th>Nro. Boletos</th>\n\
                            <th>Fecha Retiro</th>\n\
                            <th>Fecha Obra</th>\n\
                            <th>Valor Boleto</th>\n\
                            <th>Total</th>\n\
                        </tr>\n\
                    </thead>\n\
			<tr>\n\
                        <td align="center">' + obra + '</td>\n\
                        <td align="center">' + numBol + '</td>\n\
                        <td align="center">' + retiro + '</td>\n\
                        <td align="center">' + reservado + '</td>\n\
                        <td align="center">' + precioBol + '</td>\n\
                        <td align="center">' + total + '</td>\n\</tr>\n\
                </table>\n\
                <br><br>\n\
                <div  style="font-size: 15px">\n\
                    <strong>Lugar de retiro</strong>\n\
                    <p>\n\
                        San Cayetano alto, edificio 8, 3er piso de la Universidad Técnica Particular de Loja\n\
                        Loja\n\
                    </p>\n\
                    <strong>Horario de Retiro</strong>\n\
                    <p>\n\
                        Lunes a Sábado de 14h00 a 17h00\n\
                    </p>\n\
                </div>            </div> \n\
        </div>\n\
        <div id="pageFooter"  style="border-top: 1px solid #ddd;padding-bottom:4px ;background: black; text-align: center">\n\
            <p style="color: white; font-family: sans-serif; font-size: 10px">\n\
                <strong>teatroestudiolaboratorio@gmail.com</strong>\n\
            </p>\n\
        </div>';
                x = x + 1;
                pdf.create(contenido, options).toFile('/home/samypaul/Desktop/'+ nombre+'_'+obra +'-' + x +'.pdf', function (err, res) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log(res);
                    }
                });
            } else {
                res.redirecr('/noticia');
            }
        });
        res.redirect('/');
    }
}

module.exports = reporte;



