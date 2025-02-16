import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import Order from "./order.model.js";
import Product from "./product.model.js";
import Room from "./room.model.js";

const OrderItems = sequelize.define(
   "orderitems",
   {
      id: {
         type: DataTypes.INTEGER,
         autoIncrement: true,
         primaryKey: true,
      },
      orderId: {
         type: DataTypes.INTEGER,
         allowNull: false,
         references: {
            model: Order,
            key: "id",
         },
         onDelete: "CASCADE",
      },
      productId: {
         type: DataTypes.INTEGER,
         allowNull: true,
         references: {
            model: Product,
            key: "id",
         },
         onDelete: "SET NULL",
         roomId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            model: Room,
            key: "id",
         },
         onDelete: "SET NULL",
      },
      startTime: {
         type: DataTypes.DATE,
         allowNull: false,
      },
      endTime: {
         type: DataTypes.DATE,
         allowNull: false,
      },
      vipTime: {
         type: DataTypes.BOOLEAN,
         allowNull: false,
         defaultValue: false,
      },
      summa: {
         type: DataTypes.FLOAT,
         allowNull: false,
      },
   },
   { timestamps: false }
);

Order.hasMany(OrderItems, { foreignKey: "orderId", onDelete: "CASCADE" });
OrderItems.belongsTo(Order, { foreignKey: "orderId" });

Product.hasMany(OrderItems, { foreignKey: "productId", onDelete: "SET NULL" });
OrderItems.belongsTo(Product, { foreignKey: "productId" });

Room.hasMany(OrderItems, { foreignKey: "roomId", onDelete: "SET NULL" });
OrderItems.belongsTo(Room, { foreignKey: "roomId" });

export default OrderItems;
