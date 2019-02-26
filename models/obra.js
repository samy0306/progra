module.exports = function (sequelize, Sequelize) {
    var Obra = sequelize.define('obra', {
        idObra: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        external_id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4
        },
        nombre: {
            type: Sequelize.STRING(40)
        },
        multimedia: {
            type: Sequelize.STRING(150)
        },
        desc: {
            type: Sequelize.TEXT
        },
        genero: {
            type: Sequelize.STRING(20)
        },
        autor: {
            type: Sequelize.STRING(20)
        },
        fechaEstreno: {
            type: Sequelize.DATEONLY
        },
        lugarEstreno: {
            type: Sequelize.STRING(100)
        },
        horaEstreno: {
            type: Sequelize.STRING(20)
        },
        precioBoleto: {
            type: Sequelize.FLOAT(12, 2)
        },
        esVideo: {
            type: Sequelize.BOOLEAN
        },
        estado: {
            type: Sequelize.BOOLEAN
        }
    },
            {
                timestamps: false,
                freezeTableName: true
            });
    Obra.associate = function (models) {//indica que el primary key de este modelo sera llave foranea de  noticia y boleto
        models.obra.hasOne(models.multimedia, {
            foreignKey: 'id_obra'
        });
        models.obra.hasMany(models.reserva, {
            foreignKey: 'id_obra'
        });
    };
    return Obra;
};