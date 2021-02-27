'use strict';

module.exports = {
  up: async (queryInterface, DataType) => {
    queryInterface.createTable('products', {
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
    });
  },

  down: async (queryInterface, DataType) => {
    queryInterface.dropTable('products');
  }
};

