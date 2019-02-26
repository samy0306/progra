

'use strict';
var models = require('./../models');
var Actor = models.actor;
var Persona = models.persona;
var Cuenta = models.cuenta;
var Rol = models.rol;
const uuidv4 = require('uuid/v4');
var bCrypt = require('bcrypt-nodejs');
//INSTALAR ESTAS DEPENDENCIAS
var fs = require('fs');
var maxFileSize = 200 * 1024 * 1024;
var extensiones = ["jpg", "png"];
var formidable = require('formidable');

class persona {

    actualizarPersona(req, res) {
        Persona.update({
            nombre: req.body.nombre,
            cedula: req.body.cedula,
            apellido: req.body.apellido,
            fecha_Nac: req.body.fechaNac,
            direccion: req.body.direccion,
            telefono: req.body.telefono
        }, {where: {external_id: req.body.external}}).then(function (updatedPersona, created) {
            if (updatedPersona) {
                //   req.flash('info', 'Se ha creado correctamente', false);
                res.redirect('/perfil');
            }
        });
    }

    cambiarFoto(req, res) {
        var form = new formidable.IncomingForm();
        form.parse(req, function (err, fields, files) {
            if (files.archivo.size <= maxFileSize) {
                var extension = files.archivo.name.split(".").pop().toLowerCase();
                if (extensiones.includes(extension)) {
                    var nombre = files.archivo.name;
                    fs.rename(files.archivo.path, "public/galeria/images/fotosPersona/" + nombre, function (err) {
                        if (err) {
                            next(err);
                            console.log("error no se pudo subir foto");
                        }
                        Persona.update({
                            foto: "galeria/images/fotosPersona/" + files.archivo.name
                        }, {where: {external_id: fields.externalX}}).then(function (updatedPersona, created) {
                            if (updatedPersona) {
                                //   req.flash('info', 'Se ha creado correctamente', false);
                                res.redirect('/perfil');
                            }
                        });
                    });
                } else {
                    persona.eliminar(files.archivo.path);
                    req.flash('error', 'Error de extension', false);
                    res.redirect('/perfil');
                    console.log("error de extension");
                }
            } else {
                persona.eliminar(files.archivo.path);
                req.flash('error', 'Error de tamanio se admite ' + maxFileSize, false);
                res.redirect('/perfil');
                console.log("error de tamanio solo se adminte " + maxFileSize);
            }
        });
    }

    static eliminar(link) {
        fs.exists(link, function (exists) {
            if (exists) {
                console.log('Borrando ahora ...');
                fs.unlinkSync(link);
            } else {
                console.log('No se borro - no existe archivo ' + link);
            }
        });
    }

}

module.exports = persona;



