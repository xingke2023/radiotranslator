const { DataTypes } = require('sequelize');
const sequelize = require('../database/connection');

const Translation = sequelize.define('Translation', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  radioId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'radios',
      key: 'id'
    }
  },
  originalText: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  translatedText: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  sourceLanguage: {
    type: DataTypes.STRING,
    allowNull: false
  },
  targetLanguage: {
    type: DataTypes.STRING,
    allowNull: false
  },
  timestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'translations',
  timestamps: true,
  indexes: [
    {
      fields: ['radioId', 'timestamp']
    }
  ]
});

module.exports = Translation;
