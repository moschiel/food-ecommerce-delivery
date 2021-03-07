'use strict';

module.exports = {
  up: async (queryInterface, DataType) => {
    queryInterface.createTable('order', {
      id: {
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: DataType.INTEGER,    //ESSE ID É DA TABELA DE USUARIOS
      address_id: DataType.INTEGER, //ESSE ID É DA TABELA DE ENDEREÇOS
      card_id: DataType.INTEGER,    //ESSE ID É DA TABELA DE CARTÕES
      total: DataType.FLOAT,
      status: DataType.STRING,
      doneAt: DataType.DATE,
      deliveredAt: DataType.DATE,
      createdAt: DataType.DATE,
      updatedAt:  DataType.DATE,
      deleted: {
        type: DataType.INTEGER,
        defaultValue: 0
      }
    });
  },

  down: async (queryInterface, DataType) => {
    queryInterface.dropTable('order');
  }
};