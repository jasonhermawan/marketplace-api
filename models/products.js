'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class products extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      products.hasMany(models.product_images);
      products.hasMany(models.stocks);
      products.belongsTo(models.categories);
    }
  }
  products.init({
    name: DataTypes.STRING,
    categoryid: DataTypes.INTEGER,
    normalPrice: DataTypes.INTEGER,
    discountPrice: DataTypes.INTEGER,
    description: DataTypes.STRING,
    rating: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'products',
  });
  return products;
};