module.exports = function (sequelize, Sequelize) { //sequelize es objeto y Sequelize clas
    var persona = require('../models/persona');
    var Persona = new persona(sequelize, Sequelize);
    var Cuenta = sequelize.define('cuenta', {
        idCuenta: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        correo: {
            type: Sequelize.STRING(60),
            allowNull: false,
            unique: true
        },
        clave: {
            type: Sequelize.STRING
        },
        external_id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4
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