

'use strict';
var models = require('./../models');
const uuidv4 = require('uuid/v4');
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
var Noticia = models.noticia;
var Multimedia = models.multimedia;
//INSTALAR ESTAS DEPENDENCIAS
var fs = require('fs');
var maxFileSize = 200 * 1024 * 1024;
var extensiones = ["jpg", "png", "jpeg"];
var formidable = require('formidable');

class home {

    verRegNoticia(req, res) {
        if (req.isAuthenticated()) {
            if (req.user.rolN === 'asistente') {
                var esAsistente = true;
                res.render('registro',
                        {titulo: 'Telia', esAsistente});
            } else {
                res.redirect('/');
            }
        } else {
            res.redirect('/');
        }
    }

    registrarNoticia(req, res) {
        var form = new formidable.IncomingForm();
        form.parse(req, function (err, fields, files) {
            if (fields.multimedia == 1) {//video
                Noticia.create({
                    external_id: uuidv4(),
                    titulo: fields.titulo,
                    multimedia: fields.video,
                    descripcion: fields.descripcion,
                    esVideo: 1
                }).then(function (newNoticia, created) {
                    if (newNoticia) {
                        console.log('tu noticia se ha registrado correctamente');
                        Multimedia.create({
                            external_id: uuidv4(),
                            titulo: fields.titulo,
                            desc: 'NOTICIA',
                            archivo: fields.video,
                            esVideo: 1,
                            id_noticia: newNoticia.idNoticia
                        }).then(function (newMultimedia, created) {
                            if (newMultimedia) {
                                console.log('Tu Imagen se ha registrado correctamente');
                                res.redirect('/');
                            } else {
                                console.log("ERROR - No se pudo ingresar multimedia");
                                res.redirect('404');
                            }
                        });
                    } else {
                        console.log("ERROR - No se pudo ingresar multimedia");
                        res.redirect('/agregarNoticia');
                    }
                });
            } else {
                if (files.archivo.size <= maxFileSize) {
                    var extension = files.archivo.name.split(".").pop().toLowerCase();
                    if (extensiones.includes(extension)) {
                        var nombre = files.archivo.name;
                        fs.rename(files.archivo.path, "public/galeria/images/fotosGaleria/" + nombre, function (err) {
                            console.log("/////////////////////////////////////////////");
                            console.log(files.archivo.path);
                            console.log("/////////////////////////////////////////////");
                            if (err) {
                                next(err);
                                console.log("error al subir la foto :/");
                            }
                            Noticia.create({
                                external_id: uuidv4(),
                                titulo: fields.titulo,
                                multimedia: "galeria/images/fotosGaleria/" + files.archivo.name,
                                descripcion: fields.descripcion,
                                esVideo: 0
                            }).then(function (newNoticia, created) {
                                if (newNoticia) {
                                    console.log('tu noticia se ha registrado correctamente');
                                    Multimedia.create({
                                        external_id: uuidv4(),
                                        titulo: fields.titulo,
                                        desc: 'NOTICIA',
                                        archivo: "images/fotosGaleria/" + files.archivo.name,
                                        esVideo: 0,
                                        id_noticia: newNoticia.idNoticia,
                                    }).then(function (newMultimedia, created) {
                                        if (newMultimedia) {
                                            console.log('Tu Imagen se ha registrado correctamente');
                                            res.redirect('/galeria');
                                        } else {
                                            console.log("ERROR - No se pudo ingresar multimedia");
                                            res.redirect('404');
                                        }
                                    });
                                } else {
                                    console.log("ERROR - No se pudo ingresar multimedia");
                                    res.redirect('/agregarNoticia');
                                }
                            });
                        });
                    } else {
                        home.eliminar(files.archivo.path);
                        req.flash('error', 'Error de extension', false);
                        res.redirect('/agregarNoticia');
                        console.log("error de extension");
                    }
                } else {
                    home.eliminar(files.archivo.path);
                    req.flash('error', 'Error de tamanio se admite ' + maxFileSize, false);
                    res.redirect('/agregarObra');
                    console.log("error de tamanio solo se adminte " + maxFileSize);
                }
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

    verNoticia(req, res) {
        if (req.isAuthenticated()) {
            if (req.user.rolN == 'asistente') {
                sequelize.query("select * , 'true' as ESasistente from noticia", {type: Sequelize.QueryTypes.SELECT})
                        .then(function (nots) {
                            res.render('noticias',
                                    {titulo: "TELIA",
                                        lista: nots,
                                        asistente: true
                                    });
                        }).catch(function (err) {
                    console.log("Error:", err);
                    req.flash('error', 'Hubo un error');
                    res.redirect('/');
                });
            } else {
                Noticia.findAll({}).then(function (nots) {
                    var rol = req.user.rol;
                    switch (rol) {
                        case 1:
                            res.render('noticias',
                                    {titulo: "TELIA",
                                        lista: nots,
                                        usuario: true
                                    });
                            break;
                        case 2:
                            res.render('noticias',
                                    {titulo: "TELIA",
                                        lista: nots,
                                        director: true
                                    });
                            break;
                        case 4:
                            res.render('noticias',
                                    {titulo: "TELIA",
                                        lista: nots,
                                        productor: true
                                    });
                            break;
                        case 5:
                            res.render('noticias',
                                    {titulo: "TELIA",
                                        lista: nots,
                                        actor: true
                                    });
                            break;
                        default:
                            res.render('noticias',
                                    {titulo: "TELIA",
                                        lista: nots,
                                        nadie: true
                                    });
                            break
                    }
                }).catch(function (err) {
                    console.log("Error:", err);
                    req.flash('error', 'Hubo un error');
                    res.redirect('/');
                });
            }
        } else {
            Noticia.findAll({}).then(function (nots) {
                res.render('noticias',
                        {titulo: "TELIA",
                            lista: nots,
                            nadie: true
                        });
            });
        }
    }

    verEditNoticia(req, res) {
        Noticia.findOne({where: {external_id: req.params.external}}).then(function (not) {
            if (req.isAuthenticated()) {
                if (req.user.rolN === 'asistente') {
                    var editNoticia = true;
                    res.render('noticias',
                            {titulo: "TELIA",
                                not: not,
                                asistente: true,
                                editNoticia
                            });
                } else {
                    res.redirect('/noticia');
                }
            } else {
                res.redirect('/noticia');
            }
        }).catch(function (err) {
            console.log("Error:", err);
            req.flash('error', 'Hubo un error');
            res.redirect('/');
        });
    }

    actualizarNoticia(req, res) {
        var form = new formidable.IncomingForm();
        form.parse(req, function (err, fields, files) {

            if (fields.multimedia == 1) {//video
                Noticia.update({
                    titulo: fields.titulo,
                    multimedia: fields.video,
                    descripcion: fields.descripcion,
                    esVideo: 1
                }, {where: {external_id: fields.external}}).then(function (updatedNoticia, created) {
                    if (updatedNoticia) {
                        console.log('tu noticia se ha registrado correctamente');
                        Multimedia.update({
                            esVideo: 1
                        }, {where: {id_noticia: fields.idNoticia}}).then(function (updateMultimedia, created) {
                            if (updateMultimedia) {
                                console.log('Tu Imagen se ha registrado correctamente');
                                res.redirect('/galeria');
                            } else {
                                console.log("ERROR - No se pudo ingresar multimedia");
                                res.redirect('404');
                            }
                        });
                    } else {
                        console.log("ERROR - No se pudo ingresar multimedia");
                        res.redirect('/agregarNoticia');
                    }
                });
            } else if (fields.multimedia == 0) {
                if (files.archivo.size <= maxFileSize) {
                    var extension = files.archivo.name.split(".").pop().toLowerCase();
                    if (extensiones.includes(extension)) {
                        var nombre = files.archivo.name;
                        fs.rename(files.archivo.path, "public/galeria/images/fotosGaleria/" + nombre, function (err) {
                            if (err) {
                                next(err);
                                console.log("error al subir la foto :/");
                            }
                            Noticia.update({
                                titulo: fields.titulo,
                                multimedia: "galeria/images/fotosGaleria/" + files.archivo.name,
                                descripcion: fields.descripcion,
                                esVideo: 0
                            }, {where: {external_id: fields.external}}).then(function (updatedNoticia, created) {
                                if (updatedNoticia) {
                                    console.log('tu noticia se ha registrado correctamente');
                                    Multimedia.update({
                                        titulo: fields.titulo,
                                        archivo: "images/fotosGaleria/" + files.archivo.name,
                                        esVideo: 0
                                    }, {where: {id_noticia: fields.idNoticia}}).then(function (updateMultimedia, created) {
                                        if (updateMultimedia) {
                                            console.log('Tu Imagen se ha registrado correctamente');
                                            res.redirect('/galeria');
                                        } else {
                                            console.log("ERROR - No se pudo ingresar multimedia");
                                            res.redirect('404');
                                        }
                                    });
                                } else {
                                    console.log("ERROR - No se pudo ingresar multimedia");
                                    res.redirect('/agregarNoticia');
                                }
                            });
                        });
                    } else {
                        home.eliminar(files.archivo.path);
                        req.flash('error', 'Error de extension', false);
                        res.redirect('/agregarNoticia');
                        console.log("error de extension");
                    }
                } else {
                    home.eliminar(files.archivo.path);
                    req.flash('error', 'Error de tamanio se admite ' + maxFileSize, false);
                    res.redirect('/agregarObra');
                    console.log("error de tamanio solo se adminte " + maxFileSize);
                }
            } else {
                Noticia.update({
                    titulo: fields.titulo,
                    multimedia: fields.multActual,
                    descripcion: fields.descripcion
                }, {where: {external_id: fields.external}}).then(function (updatedNoticia, created) {
                    if (updatedNoticia) {
                        console.log('tu noticia se ha registrado correctamente');
                        Multimedia.update({
                            titulo: fields.titulo
                        }, {where: {id_noticia: fields.idNoticia}}).then(function (updateMultimedia, created) {
                            if (updateMultimedia) {
                                console.log('Tu Imagen se ha registrado correctamente');
                                res.redirect('/galeria');
                            } else {
                                console.log("ERROR - No se pudo ingresar multimedia");
                                res.redirect('404');
                            }
                        });
                    } else {
                        console.log("ERROR - No se pudo ingresar multimedia");
                        res.redirect('/agregarNoticia');
                    }
                });
            }
        });

    }
}





module.exports = home;





