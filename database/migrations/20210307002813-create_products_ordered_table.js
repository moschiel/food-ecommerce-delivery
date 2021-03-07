'use strict';

module.exports = {
  up: async (queryInterface, DataType) => {
    queryInterface.createTable('products_ordered', {
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
    });
  },

  down: async (queryInterface, DataType) => {
    queryInterface.dropTable('products_ordered');
  }
};
