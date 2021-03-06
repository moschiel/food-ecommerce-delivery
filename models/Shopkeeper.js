module.exports = (sequelize, DataType) => {
	const Shopkeeper = sequelize.define(
    'Shopkeeper', 
    {
      id: {
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
        username: DataType.STRING,            
        password: DataType.STRING,
        email: DataType.STRING,
        createdAt: {
          type: DataType.DATE
        },
        updatedAt: {
          type: DataType.DATE
        }
    },
    {
        tableName: 'shopkeeper',
    });
    return Shopkeeper;
};