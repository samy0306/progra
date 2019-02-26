module.exports = function (sequelize, Sequelize) { //sequelize es objeto y Sequelize clas
    var Noticia = sequelize.define('noticia', {
        idNoticia: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        external_id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4
        },
        titulo: {
            type: Sequelize.STRING(150)
        },
        multimedia: {
            type: Sequelize.STRING(150)
        },
        descripcion: {
            type: Sequelize.TEXT
        },
        esVideo: {
            type: Sequelize.BOOLEAN
        }

    },
            {freezeTableName: true,
                createdAt: 'fecha_registro',
                updatedAt: 'fecha_modificacion'
            });
    Noticia.associate = function (models) {//indica que el primary key de este modelo sera llave foranea de  noticia y boleto
        models.noticia.hasOne(models.multimedia, {
            foreignKey: 'id_noticia'
        });
    };
    return Noticia;
};