module.exports = function (sequelize, Sequelize) { //sequelize es objeto y Sequelize clas
    var persona = require('../models/persona');
    var Persona = new persona(sequelize, Sequelize);
    var Actor = sequelize.define('actor', {
        años_Exp: {
            type: Sequelize.INTEGER
        },
        isDirector: {
            type: Sequelize.BOOLEAN 
        },
        external_id: {
            type: Sequelize.UUID
        },
        desActor: {
            type: Sequelize.TEXT
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
    Actor.removeAttribute('id');//se generaba automaticamente y necesitava removerlo
    return Actor;
};