module.exports = (sequelize, DataType) => {
	const Shopkeeper = sequelize.define(
        'shopkeeper', 
        {
            username: DataType.STRING,
            password: DataType.STRING,
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