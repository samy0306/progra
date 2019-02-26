//load bcrypt
var bCrypt = require('bcrypt-nodejs');
const uuidv4 = require('uuid/v4');

module.exports = function (passport, cuenta, persona, rol, actor) {

    var Cuenta = cuenta; // modelo
    var Persona = persona; // modelo
    var Rol = rol;
    var LocalStrategy = require('passport-local').Strategy;
    //serialize
    passport.serializeUser(function (cuenta, done) {
        done(null, cuenta.idCuenta);
    });
    // deserialize user 
    passport.deserializeUser(function (idCuenta, done) {
        Cuenta.findOne({where: {idCuenta: idCuenta}, include: [{model: Persona, include: {model: Rol}}]}).then(function (cuenta) {
            if (cuenta) {
                var userinfo = {
                    idCuenta: cuenta.idCuenta,
                    id_cuenta: cuenta.external_id,
                    id_persona: cuenta.persona.external_id,
                    idPersona: cuenta.persona.idPersona,
                    nombre: cuenta.persona.apellido + " " + cuenta.persona.nombre,
                    rol: cuenta.persona.rol.idRol,
                    rolN: cuenta.persona.rol.nombre,
                    nom: cuenta.persona.nombre,
                    foto: cuenta.persona.foto
                };
//                console.log("=============DESERIALIZANDO=====================");
//                console.log(userinfo.rolN + ' ' + userinfo.nom)
//                console.log("================================================");
                done(null, userinfo);
            } else {
                done(cuenta.errors, null);
            }
        });
    });
    //registro de usuarios por passport
    passport.use('local-signup', new LocalStrategy(
            {
                usernameField: 'correo',
                passwordField: 'clave',
                passReqToCallback: true // allows us to pass back the entire request to the callback
            },
            function (req, correo, clave, done) {
                var generateHash = function (clave) {
                    return bCrypt.hashSync(clave, bCrypt.genSaltSync(8), null);
                };
                //verificar si el email no esta registrado
                Cuenta.findOne({
                    where: {
                        correo: correo
                    }
                }).then(function (cuenta) {
                    if (cuenta) {
                        return done(null, false, {
                            //    message: req.flash('error_registro', 'El correo ya esta registrado')
                        });
                    } else {
                        var userPassword = generateHash(clave);
                        Rol.findOne({
                            where: {nombre: 'usuario'}
                        }).then(function (rol) {
                            if (rol) {
                                var dataPersona =
                                        {
                                            apellido: req.body.apellido,
                                            nombre: req.body.nombre,
                                            cedula: req.body.cedula,
                                            telefono: req.body.telefono,
                                            direccion: req.body.direccion,
                                            id_rol: rol.idRol,
                                            foto: 'galeria/images/fotosPersona/usuarioPerfil.jpg',
                                            sexo: req.body.sexo,
                                            external_id: uuidv4(),
                                            fecha_Nac: req.body.fechaNac
                                        };
                                Persona.create(dataPersona).then(function (newPersona, created) {
                                    if (!newPersona) {
                                        return done(null, true, {
                                            //     message: req.flash('error_registro', 'La Cuenta no se puede Crear')
                                        });
                                    }
                                    if (newPersona) {
                                        var dataCuenta = {
                                            correo: correo,
                                            clave: userPassword,
                                            id_persona: newPersona.idPersona,
                                            external_id: uuidv4()
                                        };
                                        Cuenta.create(dataCuenta).then(function (newCuenta, created) {
                                            if (newCuenta) {
                                                return done(null, newCuenta);
                                            }
                                            if (!newCuenta) {
                                                console.log("cuenta no se pudo crear");
                                                //borrar persona
                                                return done(null, false, {
                                                    //     message: req.flash('error_registro', 'La Cuenta no se puedo Crear')
                                                });
                                            }

                                        });
                                    }
                                });
                            } else {
                                console.log('Rol No Existe');
                                return done(null, false, {
                                    //  message: req.flash('error_registro', 'Rol no existe')
                                });
                            }
                        });
                    }
                });
            }
    ));

    //INICIO DE SESIÓN

    passport.use('local-signin', new LocalStrategy(
            {
                usernameField: 'correo',
                passwordField: 'clave',
                passReqToCallback: true // allows us to pass back the entire request to the callback
            },
            function (req, email, password, done) {
                var Cuenta = cuenta;
                var isValidPassword = function (userpass, password) {
                    return bCrypt.compareSync(password, userpass);
                };
                Cuenta.findOne({where: {correo: email}}).then(function (cuenta) {
                    if (!cuenta) {
                        console.log('CUENTA NO EXISTE');
                        return done(null, false, {message: req.flash('error_login', 'Cuenta no existe')});
                    }

                    if (!isValidPassword(cuenta.clave, password)) {
                        console.log('__________CLAVE INCONRRECTA-___________')
                        return done(null, false, {message: req.flash('error_login', 'Clave incorrecta')});
                    }

                    var userinfo = cuenta.get();
                    return done(null, userinfo);
                }).catch(function (err) {
                    console.log("Error:", err);
                    return done(null, false, {message: req.flash('error_login', 'Cuenta erronea')});
                });
            }
    ));
};
