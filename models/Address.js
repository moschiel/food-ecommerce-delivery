
module.exports = (sequelize, DataType) => {
	const Address = sequelize.define(
		'Address', 
	{
    id: {
      type: DataType.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    select: DataType.INTEGER,
    street: DataType.STRING,
    number: DataType.STRING,
    complement: DataType.STRING,
    district: DataType.STRING,
    city: DataType.STRING,
    state: DataType.STRING,
    postal_code: DataType.STRING,
    type: DataType.STRING,
    createdAt: {
      type: DataType.DATE
    },
    updatedAt: {
      type: DataType.DATE
    }
	},{
    tableName: 'address',
	});
	return Address;
};