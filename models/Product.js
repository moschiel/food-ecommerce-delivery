
module.exports = (sequelize, DataType) => {
	const Product = sequelize.define(
		'Product', 
	{
    id: {
      type: DataType.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: DataType.STRING,
    stock: DataType.INTEGER,
    price: DataType.FLOAT,
    description: DataType.STRING,
    image: DataType.STRING,
    category: DataType.STRING,
    deleted: {
      type: DataType.INTEGER,
      defaultValue: 0
    },
    createdAt: {
      type: DataType.DATE
    },
    updatedAt: {
      type: DataType.DATE
    }
	},{
    tableName: 'products',
	});
	return Product;
};