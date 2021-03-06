module.exports = (sequelize, DataType) => {

    const User = sequelize.define('User', {
        id:{
            type: DataType.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        name: {
            type: DataType.STRING,
            allowNull: false
        },
        email: DataType.STRING,
        password: DataType.STRING(255)
    },
    {
        tableName: "users"
    });
    return User;
}