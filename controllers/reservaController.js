'use strict';
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

const uuidv4 = require('uuid/v4');
var forEach = require('sync-each');
var models = require('./../models');
var Obra = models.obra;
var Reserva = models.reserva;
var Cuenta = models.cuenta;
const {Op} = require('sequelize');
var moment = require('moment');
var fechaHoy = moment().format('YYYY[-]MM[-]DD');
var obrasTemp = [];
var reservasTemp = [];
class home {
    verRegReserva(req, res) {
        obrasTemp = [];
        Obra.findAll({}).then(function (obras) {
            for (var i = 0; i < obras.length; i++) {//sirve para filtrar las fechas
                if (fechaHoy <= moment(obras[i].fechaEstreno).subtract(3, 'days').format('YYYY[-]MM[-]DD')) {
                    obrasTemp[i] = obras[i];
                }
            }
            if (req.isAuthenticated()) {
                if (req.user.rolN !== 'director') {
                    var rol = req.user.rol;
                    switch (rol) {
                        case 1:
                            res.render('reserva',
                                    {titulo: 'Telia', footer: 'partials/footer', nav: 'partials/nav', 'usuario': true, reserva: true, obras: obrasTemp});
                            break;
                        case 3:
                            res.render('reserva',
                                    {titulo: 'Telia', footer: 'partials/footer', nav: 'partials/nav', 'asistente': true, reserva: true, obras: obrasTemp});
                            break;
                        case 4:
                            res.render('reserva',
                                    {titulo: 'Telia', footer: 'partials/footer', nav: 'partials/nav', 'productor': true, reserva: true, obras: obrasTemp});
                            break;
                        case 5:
                            res.render('reserva',
                                    {titulo: 'Telia', footer: 'partials/footer', nav: 'partials/nav', 'actor': true, reserva: true, obras: obrasTemp});
                            break;
                    }
                } else {
                    res.redirect('/reservas');
                }

            } else {
                res.redirec('/');
            }
        }).catch(function (err) {
            console.log("Error:", err);
            req.flash('error', 'Hubo un error');
            res.redirect('/');
        });
    }

    verEditarReserva(req, res) {
        var ObraSelecionada;
        var ban = false;
        Obra.findAll({}).then(function (obras) {
            Reserva.findOne({where: {external_id: req.params.external}}).then(function (listaReservas) {
                for (var i = 0; i < obras.length; i++) {
                    if (obras[i].idObra === listaReservas.id_obra) {
                        ObraSelecionada = obras[i];
                    }
                }
                if (req.isAuthenticated()) {
                if (req.user.rolN !== 'director') {
                                        var rol = req.user.rol;
                    switch (rol) {
                        case 1:
                            res.render('reserva',
                                    {
                                        titulo: 'Reserva Edicion',
                                        footer: 'partials/footer',
                                        nav: 'partials/nav',
                                        'usuario': true,
                                        editar: true,
                                        obras: obras,
                                        listRes: listaReservas,
                                        ObraSelect: ObraSelecionada
                                    });
                            break;
                        case 3:
                            res.render('reserva',
                                    {titulo: 'Reserva Edicion',
                                        footer: 'partials/footer',
                                        nav: 'partials/nav',
                                        'asistente': true,
                                        editar: true,
                                        obras: obras,
                                        listRes: listaReservas,
                                        ObraSelect: ObraSelecionada
                                    });
                            break;
                        case 4:
                            res.render('reserva',
                                    {titulo: 'Reserva Edicion',
                                        footer: 'partials/footer',
                                        nav: 'partials/nav',
                                        'productor': true,
                                        editar: true,
                                        obras: obras,
                                        listRes: listaReservas,
                                        ObraSelect: ObraSelecionada
                                    });
                            break;
                        case 5:
                            res.render('reserva',
                                    {titulo: 'Reserva Edicion',
                                        footer: 'partials/footer',
                                        nav: 'partials/nav',
                                        'actor': true,
                                        editar: true,
                                        obras: obras,
                                        listRes: listaReservas,
                                        ObraSelect: ObraSelecionada
                                    });
                            break;
                    }
                }else{
                    res.redirect('/reservas');
                }

                } else {
                    res.redirect('/');
                }
            }).catch(function (err) {
                console.log("Error:", err);
                req.flash('error', 'Hubo un error');
                res.redirect('/');
            });
        }).catch(function (err) {
            console.log("Error:", err);
            req.flash('error', 'Hubo un error');
            res.redirect('/');
        });
    }

    registrarReserva(req, res) {
        var numBol = 0;
        var sum = 0;
        Reserva.findOne({where: {id_obra: req.body.obra, exteral_idCuenta: req.user.id_cuenta}}).then(reserva => {
            if (reserva) {
                sum = ((reserva.numBoletos * 1) + (req.body.boletos * 1));
                if (sum >= 5) {
                    numBol = 5;
                } else {
                    numBol = (reserva.numBoletos * 1) + (req.body.boletos * 1);
                }
                Reserva.update({
                    numBoletos: numBol
                }, {where: {external_id: reserva.external_id}}).then(function (updatedReserva, created) {
                    if (updatedReserva) {
                        console.log('Se actualizado su reserva');
                        req.flash('info', 'Se ha creado correctamente', false);
                        res.redirect('/MISRESERVAS');
                    }
                });
            } else {
                Reserva.create({
                    external_id: uuidv4(),
                    fechaReserva: req.body.fechahoy,
                    fechasRetiroBoletos: req.body.fechaRetiro,
                    numBoletos: req.body.boletos,
                    exteral_idCuenta: req.user.id_cuenta,
                    estado: 0,
                    id_obra: req.body.obra
                }).then(function (newReserva, created) {
                    if (newReserva) {
                        console.log("********");
                        console.log('Tu reserva se ha registrado correctamente');
                        res.redirect('/');
                    }
                });
            }
        });
    }

    modificarReserva(req, res) {
        Reserva.update({
            numBoletos: req.body.boletos,
        }, {where: {external_id: req.body.external}}).then(function (updatedReserva, created) {
            if (updatedReserva) {
                console.log('Se actualizado su reserva');
                req.flash('info', 'Se ha creado correctamente', false);
                res.redirect('/MISRESERVAS');
            }
        });
    }

    function(req, res) {
        sequelize.query("select  reserva.estado,reserva.idReserva, 'true' AS ESdirector, obra.nombre as obra, persona.nombre as persona, obra.fechaEstreno, reserva.fechasRetiroBoletos, reserva.numBoletos, reserva.external_id  \n\
from reserva inner join cuenta on  reserva.exteral_idCuenta = cuenta.external_id \n\
inner join persona on cuenta.id_persona = persona.idPersona \n\
inner join obra on obra.idObra = reserva.id_obra \n\
where CURDATE() <= DATE_ADD(obra.fechaEstreno, INTERVAL 1 DAY)",
                {type: Sequelize.QueryTypes.SELECT})
                .then(function (reservas) {
                    if (req.isAuthenticated()) {
                        if (req.user.rolN === 'director') {
                            res.render('reserva', {
                                titulo: 'Telia',
                                director: true,
                                lista: reservas,
                                listar: true
                            });
                        } else {
                            var per = req.user.id_cuenta;
                            sequelize.query("select reserva.estado,obra.nombre as obra, persona.nombre as persona, obra.fechaEstreno, reserva.fechasRetiroBoletos, reserva.numBoletos, reserva.external_id,  \n\
cuenta.external_id as cuentaExternal from reserva inner join cuenta on  reserva.exteral_idCuenta = cuenta.external_id \n\
inner join persona on cuenta.id_persona = persona.idPersona \n\
inner join obra on obra.idObra = reserva.id_obra \n\
where CURDATE() <= DATE_ADD(obra.fechaEstreno, INTERVAL 1 DAY) and cuenta.external_id = ?",
                                   { replacements: [per], type: sequelize.QueryTypes.SELECT })
                                    .then(function (reserv) {
                                        switch (req.user.rol) {
                                            case 1:
                                                res.render('reserva',
                                                        {titulo: 'Telia', 'usuario': true, lista: reserv, listar: true});
                                                break;
                                            case 3:
                                                res.render('reserva',
                                                        {titulo: 'Telia', 'asistente': true, lista: reserv, listar: true});
                                                break;
                                            case 4:
                                                res.render('reserva',
                                                        {titulo: 'Telia', 'productor': true, lista: reserv, listar: true});
                                                break;
                                            case 5:
                                                res.render('reserva',
                                                        {titulo: 'Telia', 'actor': true, lista: reserv, listar: true});
                                                break;
                                        }
                                    });
                        }
                    } else {
                        res.redirect('/');
                    }
                });
    }

    cambiarEstado(req, res) {
        Reserva.findOne({where: {external_id: req.params.external}}).then(function (reserv) {
            if (reserv.estado == 0) {
                Reserva.update({
                    estado: 1
                }, {where: {external_id: req.params.external}});
                res.redirect('/reservas');
            } else {
                Reserva.update({
                    estado: 0
                }, {where: {external_id: req.params.external}});
                res.redirect('/reservas');
            }
        });
    }

}

module.exports = home;



