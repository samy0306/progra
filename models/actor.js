module.exports = function (sequelize, Sequelize) { //sequelize es objeto y Sequelize clas
    var persona = require('../models/persona');
    var Persona = new persona(sequelize, Sequelize);
    var Actor = sequelize.define('actor', {
//        id_actor: {
//            autoIncrement: true,
//            primaryKey: true,
//            type: Sequelize.INTEGER
//        },
        años_Exp: {
            type: Sequelize.INTEGER
        },
        obrasRealizadas: {
            type: Sequelize.STRING(150)
        },
        agrupaciones_anteriores: {
            type: Sequelize.STRING(150)
        },
        external_id: {
            type: Sequelize.UUID
        }
    },
            {freezeTableName: true,
                createdAt: 'fecha_ingreso'
            });
    Actor.belongsTo(Persona, {//en este modelo se aloja la llave principal de persona(clave foranea)
        foreignKey: 'id_actor',
        primaryKey: true,
        type: Sequelize.INTEGER,
        constraints: false
    });
    return Persona;
};