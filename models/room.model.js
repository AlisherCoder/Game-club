import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Room = sequelize.define("rooms", {
   id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
   },
   roomNumber: {
      type: DataTypes.INTEGER,
      unique: true,
      allowNull: false,
   },
   price: {
      type: DataTypes.FLOAT,
      allowNull: false,
   },
   countComps: {
      type: DataTypes.INTEGER,
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

export default Room;
