import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import User from "./user.model.js";

const Order = sequelize.define("orders", {
   id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
   },
   userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
         model: User,
         key: "id",
      },
      onDelete: "CASCADE",
   },
   totalSum: {
      type: DataTypes.FLOAT,
      allowNull: false,
   },
   payment: {
      type: DataTypes.STRING,
      allowNull: false,
   },
   payStatus: {
      type: DataTypes.ENUM("paid", "pending", "unpaid"),
      allowNull: false,
      defaultValue: "pending",
   },
});

User.hasMany(Order, { foreignKey: "userId", onDelete: "CASCADE" });
Order.belongsTo(User, { foreignKey: "userId" });

export default Order;
