
module.exports = (sequelize, DataType) => {
	const Cards = sequelize.define(
		'Cards', 
	{
    id: {
      type: DataType.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    selected: DataType.INTEGER,
    type: DataType.STRING,
    brand: DataType.STRING,
    number: DataType.STRING,
    expirationDate: DataType.STRING,
    cvv: DataType.STRING,
    holderName: DataType.STRING,
    holderCpf: DataType.STRING,
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
    tableName: 'cards',
	});
	return Cards;
};