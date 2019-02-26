module.exports = function (sequelize, Sequelize) { //sequelize es objeto y Sequelize clas
    var obra = require('../models/obra');
    var Obra = new obra(sequelize, Sequelize);
    var noticia = require('../models/obra');
    var Noticia = new noticia(sequelize, Sequelize);
    var Multimedia = sequelize.define('multimedia', {
        idMultimedia: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        external_id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4
        },
        titulo: {
            type: Sequelize.STRING(40)
        },
        desc: {
            type: Sequelize.TEXT
        },
        archivo: {
            type: Sequelize.STRING(250)
        },
        esVideo: {
            type: Sequelize.BOOLEAN
        }
    },
            {freezeTableName: true,
                createdAt: 'fecha_registro',
                updatedAt: 'fecha_modificacion'
            });
    Multimedia.belongsTo(Obra, {//en este modelo se aloja la llave principal de obra(clave foranea)
        foreignKey: 'id_obra',
        constraints: false
    });
    Multimedia.belongsTo(Noticia, {//en este modelo se aloja la llave principal de obra(clave foranea)
        foreignKey: 'id_noticia',
        constraints: false
    });
    return Multimedia;
};