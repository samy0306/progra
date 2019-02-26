var models = require('../../models');
const uuidv4 = require('uuid/v4');
var bCrypt = require('bcrypt-nodejs');
var Rol = models.rol;
var Cuenta = models.cuenta;
var Persona = models.persona;
var Actor = models.actor;
var init = function () {
    Rol.findOrCreate({where: {nombre: 'usuario'}, defaults: {idRol: '0', nombre: 'usuario'}}).spread((roll, created) => {
        console.log(roll.get({
            plain: true
        }));
    });
    Rol.findOrCreate({where: {nombre: 'director'}, defaults: {idRol: '0', nombre: 'director'}}).spread((roll, created) => {
        console.log(roll.get({
            plain: true
        }));
    });
    Rol.findOrCreate({where: {nombre: 'asistente'}, defaults: {idRol: '0', nombre: 'asistente'}}).spread((roll, created) => {
        console.log(roll.get({
            plain: true
        }));
    });
    Rol.findOrCreate({where: {nombre: 'productor'}, defaults: {idRol: '0', nombre: 'productor'}}).spread((roll, created) => {
        console.log(roll.get({
            plain: true
        }));
    });
    Rol.findOrCreate({where: {nombre: 'actor'}, defaults: {idRol: '0', nombre: 'actor'}}).spread((roll, created) => {
        console.log(roll.get({
            plain: true
        }));
    });

    Persona.findOrCreate({where: {id_rol: '2', nombre: 'Admin'}, defaults: {
            idPersona: 0,
            cedula: '1105279044',
            nombre: 'Admin',
            apellido: 'Director',
            direccion: 'Loja Ecuador',
            telefono: '0979563365',
            fecha_Nac: '2003-04-02',
            multimedia: 'aqui va foto ps',
            sexo: 0,
            foto: '/galeria/images/fotosPersona/usuarioPerfil.jpg',
            external_id: uuidv4(),
            fecha_registro: '2003-04-02',
            fecha_modificacion: '2003-04-02',
            id_rol: '2'
        }}).spread((user, persona) => {
        Actor.findOrCreate({where: {id_actor: 1}, defaults: {
                años_Exp: 15,
                obrasRealizadas: 58,
                agrupaciones_anteriores: 'TELIA España',
                external_id: uuidv4(),
                id_actor: 1 ,
                isDirector: true
            }}).spread((user_actor, actor) => {
            var clave = bCrypt.hashSync('123456', bCrypt.genSaltSync(8), null);
            Cuenta.findOrCreate({where: {id_persona: '1', correo: 'director@gmail.com'}, defaults: {
                    idCuenta: '0',
                    correo: 'director@gmail.com',
                    clave: clave,
                    external_id: uuidv4(),
                    fecha_registro: '2003-04-02',
                    fecha_modificacion: '2003-04-02',
                    id_persona: '1'
                }}).spread((user_cuenta, cuenta) => {
                console.log("Se inserto persona y cuenta del asistente");
            });
        });

    });

//    Persona.findOrCreate({where: {id_rol: '3', nombre: 'Asistente'}, defaults: {
//            idPersona: 0,
//            cedula: '1105278044',
//            nombre: 'Asistente',
//            apellido: 'asistente',
//            direccion: 'Loja Ecuador',
//            telefono: '0979563365',
//            fecha_Nac: '2003-04-02',
//            multimedia: 'aqui va foto ps',
//            sexo: 'M',
//            foto: '/galeria/images/fotosPersona/usuarioPerfil.jpg',
//            external_id: uuidv4(),
//            fecha_registro: '2003-04-02',
//            fecha_modificacion: '2003-04-02',
//            id_rol: '3'
//        }}).spread((user, persona) => {
//        Actor.findOrCreate({where: {id_actor: persona.idPersona}, defaults: {
//                años_Exp: 3,
//                obrasRealizadas: 4,
//                agrupaciones_anteriores: 'La Mancha',
//                external_id: persona.external_id,
//                id_actor: persona.idPersona,
//                isDirector: false
//
//            }}).spread((user_actor, actor) => {
//            var clave = bCrypt.hashSync('123456', bCrypt.genSaltSync(8), null);
//            Cuenta.findOrCreate({where: {id_persona: '2', correo: 'asistente@gmail.com'}, defaults: {
//                    idCuenta: '0',
//                    correo: 'asistente@gmail.com',
//                    clave: clave,
//                    external_id: uuidv4(),
//                    fecha_registro: '2003-04-02',
//                    fecha_modificacion: '2003-04-02',
//                    id_persona: '2'
//                }}).spread((user_cuenta, cuenta) => {
//                console.log("Se inserto persona y cuenta del asistente");
//            });
//        });
//
//    });
//
//    Persona.findOrCreate({where: {id_rol: '4', nombre: 'productor'}, defaults: {
//            idPersona: 0,
//            cedula: '1105109044',
//            nombre: 'productor',
//            apellido: 'admin',
//            direccion: 'Loja Ecuador',
//            telefono: '0979563365',
//            fecha_Nac: '2003-04-02',
//            multimedia: 'aqui va foto ps',
//            sexo: 'M',
//            foto: '/galeria/images/fotosPersona/usuarioPerfil.jpg',
//            external_id: uuidv4(),
//            fecha_registro: '2003-04-02',
//            fecha_modificacion: '2003-04-02',
//            id_rol: '4'
//        }}).spread((user, persona) => {
//        Actor.findOrCreate({where: {id_actor: persona.idPersona}, defaults: {
//                años_Exp: 2,
//                obrasRealizadas: 4,
//                agrupaciones_anteriores: 'Lúdico Teatro',
//                external_id: persona.external_id,
//                id_actor: persona.idPersona,
//                isDirector: false
//
//            }}).spread((user_actor, actor) => {
//            var clave = bCrypt.hashSync('123456', bCrypt.genSaltSync(8), null);
//            Cuenta.findOrCreate({where: {id_persona: '3', correo: 'productor@gmail.com'}, defaults: {
//                    idCuenta: '0',
//                    correo: 'productor@gmail.com',
//                    clave: clave,
//                    external_id: uuidv4(),
//                    fecha_registro: '2003-04-02',
//                    fecha_modificacion: '2003-04-02',
//                    id_persona: '3'
//                }}).spread((user_cuenta, cuenta) => {
//                console.log("Se inserto persona y cuenta del asistente");
//            });
//        });
//
//    });
};
module.exports = init();