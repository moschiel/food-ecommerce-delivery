
module.exports = (sequelize, DataType) => {
	const ProdutcsOrdered = sequelize.define('ProdutcsOrdered', 
        {
            id: {
                type: DataType.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            order_id: DataType.INTEGER,   //ESSE ID É DA TABELA DE PEDIDOS
            product_id: DataType.INTEGER, //ESSE ID É DA TABELA DE PRODUTOS
            amount: DataType.INTEGER,
            name: DataType.STRING,
            price: DataType.FLOAT,
            createdAt: DataType.DATE,
            updatedAt: DataType.DATE,
            deleted: {
                type: DataType.INTEGER,
                defaultValue: 0
            }
        },
        {
            tableName: 'products_ordered',
        }
    );
	return ProdutcsOrdered;
};