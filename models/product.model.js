import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Product = sequelize.define("products", {
   id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
   },
   compNumber: {
      type: DataTypes.INTEGER,
      unique: true,
      allowNull: false,
   },
   price: {
      type: DataTypes.FLOAT,
      allowNull: false,
   },
   compType: {
      type: DataTypes.STRING,
      allowNull: false,
   },
   status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
   },
   image: {
      type: DataTypes.STRING,
      allowNull: false,
   },
   description: {
      type: DataTypes.STRING,
      allowNull: false,
   },
});

export default Product;
