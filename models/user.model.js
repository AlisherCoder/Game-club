import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const User = sequelize.define("users", {
   id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
   },
   name: {
      type: DataTypes.STRING,
      allowNull: false,
   },
   phone: {
      type: DataTypes.STRING,
      allowNull: false,
   },
   password: {
      type: DataTypes.STRING,
      allowNull: false,
   },
   role: {
      type: DataTypes.ENUM("admin", "user"),
      defaultValue: "user",
      allowNull: false,
   },
   isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
   },
});

export default User;
