module.exports = function (sequelize, Sequelize) {
    var Rol = sequelize.define('rol', {
        idRol: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        nombre: {
            type: Sequelize.STRING(20)
        }
    },
            {
                timestamps: false,
                freezeTableName: true
            });
    Rol.associate = function (models) {//indica que el primary key de este modelo sera llave foranea de  persona
        models.rol.hasOne(models.persona, {
            foreignKey: 'id_rol'
        });
    };
    return Rol;
};