module.exports = function (sequelize, Sequelize) {
    var obra = require('../models/obra');
    var Obra = new obra(sequelize, Sequelize);
    var Reserva = sequelize.define('reserva', {
        idReserva: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        external_id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4
        },
        fechaReserva: {
            type: Sequelize.DATEONLY
        },
        fechasRetiroBoletos: {
            type: Sequelize.DATEONLY
        },
        numBoletos: {
            type: Sequelize.INTEGER
        },
        exteral_idCuenta: {
            type: Sequelize.UUID
        },
        estado: {
            type: Sequelize.BOOLEAN
        }
    },
            {freezeTableName: true,
                createdAt: 'fecha_registro',
                updatedAt: 'fecha_modificacion'
            });
    Reserva.belongsTo(Obra, {//en este modelo se aloja la llave principal de obra(clave foranea)
        foreignKey: 'id_obra',
        constraints: false
    });
    return Reserva;
};
