var models = require('./../models');
var Persona = models.persona;
var Cuenta = models.cuenta;
var Actor = models.actor;

'use strict';
class CuentaController {
    verLogin(req, res) {
        if (!req.isAuthenticated()) {
            var esinicio = true;
            res.render('registro', {titulo: 'Telia', esinicio});
        } else {
            res.redirect('/');
        }
    }

    verRegistro(req, res) {
        if (!req.isAuthenticated()) {
            var esregUsuario = true;
            res.render('registro', {titulo: 'Telia', esregUsuario});
        } else {
            res.redirect('/');
        }
    }

    cerrar(req, res) {
        req.session.destroy();
        res.redirect("/");
    }

    verPerfil(req, res) {
        if (req.isAuthenticated()) {
            var rol = req.user.rol;
            var nombre = req.user.nom;
            var multimedia = req.user.foto;
            Persona.findOne({where: {external_id: req.user.id_persona}}).then(function (persona) {
                console.log('========' + req.user.idPersona + '======');
                Actor.findOne({where: {id_actor: req.user.idPersona}}).then(function (actor) {
                    console.log('========' + actor + '======');
                    switch (rol) {
                        case 1:
                            res.render('perfiles',
                                    {titulo: "TELIA",
                                        usuario: true,
                                        nombre,
                                        multimedia,
                                        persona
                                    });
                            break;
                        case 2:
                            res.render('perfiles',
                                    {titulo: "TELIA",
                                        director: true,
                                        nombre,
                                        multimedia,
                                        persona,
                                        actor
                                    });
                            break;
                        case 3:
                            res.render('perfiles',
                                    {titulo: "TELIA",
                                        asistente: true,
                                        nombre,
                                        multimedia,
                                        persona,
                                        actor
                                    });
                            break;
                        case 4:
                            res.render('perfiles',
                                    {titulo: "TELIA",
                                        productor: true,
                                        nombre,
                                        multimedia,
                                        persona,
                                        actor
                                    });
                            break;
                        case 5:
                            res.render('perfiles',
                                    {titulo: "TELIA",
                                        actors: true,
                                        nombre,
                                        multimedia,
                                        persona,
                                        actor
                                    });
                            break;
                    }
                });
            });
        } else {
            res.redirect('/');
        }
    }

    bajarCuenta(req, res) {
        if (req.isAuthenticated()) {
            Persona.update({
                id_rol: 1
            }, {where: {idPersona: req.body.personX}}).then(function (updatedPerson, created) {
                if (updatedPerson) {
                    Actor.destroy({where: {id_actor: req.body.personX}}).then(function () {
                    });
                    res.redirect('/verActores');
                } else {
                    console.log('error, no se pudo actualizar');
                    res.redirect('/');
                }
            });
        } else {
            res.redirect('/');
        }
    }
}

module.exports = CuentaController;

