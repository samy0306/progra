var express = require('express');
var router = express.Router();
var passport = require('passport');
var home = require('../controllers/home');
var homeController = new home();
var cuenta = require('../controllers/cuentaController');
var cuentaController = new cuenta();
var actor = require('../controllers/actorController');
var actorController = new actor();
var noticia = require('../controllers/noticiaController');
var noticiaController = new noticia();
var obra = require('../controllers/obraController');
var obraController = new obra();
var reserva = require('../controllers/reservaController');
var reservaController = new reserva();
var multi = require('../controllers/multimediaController');
var multimediaController = new multi();
var persona = require('../controllers/personaController');
var personaController = new persona();
var correo = require('../controllers/mailController');
var mailController = new correo();
var reporte = require('../controllers/reporteController');
var reporteController = new reporte();


router.post('/inicioSesion/entrar',
        passport.authenticate('local-signin', {successRedirect: '/',
            failureRedirect: '/inicioSesion', failureFlash: true}
        ));

//PERSONA
router.get('/perfil', cuentaController.verPerfil);
router.post('/actualizarUsuario', personaController.actualizarPersona);
router.post('/actualizarfotoUsuario', personaController.cambiarFoto);


//Cuenta
router.get('/', homeController.verPrincipal);
router.get('/inicioSesion', cuentaController.verLogin);
router.post('/bajarCuenta', cuentaController.bajarCuenta);
router.post('/registro/guardar',
        passport.authenticate('local-signup', {
            successRedirect: '/perfil',
            failureRedirect: '/registro'}
        ));

//Noticia
router.get('/agregarNoticia', noticiaController.verRegNoticia);
router.get('/noticia', noticiaController.verNoticia);
router.get('/editarNoticia/:external', noticiaController.verEditNoticia);
router.post('/registro/guardarNoticia', noticiaController.registrarNoticia);
router.post('/editarNoticia', noticiaController.actualizarNoticia);


//Obra
router.get('/agregarObra', obraController.verRegObra);
router.get('/obras', obraController.verObra);
router.get('/editarObra/:external',obraController.verEditObra);
router.post('/registro/guardarObra', obraController.registrarObra);
router.post('/editarObra', obraController.actualizarObra);

//actor
router.get('/registro', cuentaController.verRegistro);
router.get('/agregarActor', actorController.verRegActor);
router.get('/cerrar', cuentaController.cerrar);
router.post('/registro/guardarActor', actorController.agregarActor);
router.get('/verActores', actorController.listarActor);
router.post('/actualizarActor', actorController.actualizarActor);
router.get('/editarActor/:externalX', actorController.verEditActor);

//reserva
router.get('/RESERVAR', reservaController.verRegReserva);
router.post('/registro/guardarReserva', reservaController.registrarReserva);
router.post('/registro/actualizarReserva', reservaController.modificarReserva);
router.get('/MISRESERVAS', reservaController.function);
router.get('/reservas', reservaController.function);
router.get('/editarReserva/:external', reservaController.verEditarReserva);
router.post('/editEstado/:external', reservaController.cambiarEstado);

//multimedia
router.get('/galeria', multimediaController.verGaleria);
router.post('/galeria/guardarMult', multimediaController.guardarImagenGaleria);

//correo
router.post('/enviarCorreo', mailController.enviarCorreo);

//PDF REPORTE
router.get('/comprobantepdf/:external', reporteController.crearPDF );


module.exports = router;
