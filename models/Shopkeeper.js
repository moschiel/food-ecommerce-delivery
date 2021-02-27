module.exports = (sequelize, DataType) => {
	const Shopkeeper = sequelize.define(
        'Shopkeeper', 
        {
          username: {
            type: DataType.STRING,
            primaryKey: true,
          },             
            password: DataType.STRING(255),
            email: DataType.STRING,
            createdAt: {
              type: DataType.DATE
            },
            updatedAt: {
              type: DataType.DATE
            }
        },{
            tableName: 'shopkeeper',
            });
            return Shopkeeper;
        };