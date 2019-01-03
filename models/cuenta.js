module.exports = function (sequelize, Sequelize) { //sequelize es objeto y Sequelize clas
    var persona = require('../models/persona');
    var Persona = new persona(sequelize, Sequelize);
    var Cuenta = sequelize.define('cuenta', {
        idCuenta: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        usuario: {
            type: Sequelize.STRING(10),
            allowNull: false,
            unique: true
        },
        clave: {
            type: Sequelize.STRING(50),
            allowNull: false,
            unique: true
        },
        external_id: {
            type: Sequelize.UUID
        }
    },
            {freezeTableName: true,
                createdAt: 'fecha_registro',
                updatedAt: 'fecha_modificacion'
            });
    Cuenta.belongsTo(Persona, {//en este modelo se aloja la llave principal de persona(clave foranea)
        foreignKey: 'id_persona',
        constraints: false
    });
    return Cuenta;
};