'use strict';

module.exports = {
  up: async (queryInterface, DataType) => {
    queryInterface.createTable('address', {
        id: {
          type: DataType.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        user_id: DataType.INTEGER, //ESSE ID É DA TABELA DE USUARIOS
        selected: DataType.INTEGER,
        street: DataType.STRING,
        number: DataType.STRING,
        complement: DataType.STRING,
        district: DataType.STRING,
        city: DataType.STRING,
        state: DataType.STRING,
        postal_code: DataType.STRING,
        type: DataType.STRING,
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
    queryInterface.dropTable('address');
  }
};
