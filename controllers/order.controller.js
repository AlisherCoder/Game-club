import Order from "../models/order.model.js";
import OrderItems from "../models/orderItems.model.js";
import User from "../models/user.model.js";
import {
   OrderPatchValid,
   OrderValid,
} from "../validations/order.validation.js";
import { orderSearchValid } from "../validations/search.valid.js";

export async function getAll(req, res) {
   try {
      let data = await Order.findAll({ include: [User, OrderItems] });

      if (!data.length) {
         return res.status(200).json({ message: "No orders yet" });
      }

      res.status(200).json({ data });
   } catch (error) {
      res.status(500).json({ message: error.message });
   }
}

export async function getOne(req, res) {
   try {
      let { id } = req.params;
      let found = await Order.findByPk(id, { include: [User, OrderItems] });
console.log(111)
      if (!found) {
         return res.status(404).json({ message: "Not found data" });
      }
      console.log(found.userId, req.user.id)
      if (found.userId != req.user.id) {
         return res.status(400).json({ message: "Not allowed" });
      }

      res.status(200).json({ data: found });
   } catch (error) {
      res.status(500).json({ message: error.message });
   }
}

export async function create(req, res) {
   try {
      let { error, value } = OrderValid.validate(req.body);
      if (error) {
         return res.status(422).json({ message: error.details[0].message });
      }

      let { products, ...data } = value;
      let created = await Order.create(data);

      if (!products.length) {
         return res.status(422).json({ message: "Products cannot be empty" });
      }

      let orderitems = await OrderItems.bulkCreate(
         products.map((oi) => ({ ...oi, orderId: created.id }))
      );

      res.status(201).json({ data: created });
   } catch (error) {
      res.status(500).json({ message: error.message });
   }
}

export async function update(req, res) {
   try {
      let { error, value } = OrderPatchValid.validate(req.body);
      if (error) {
         return res.status(422).json({ message: error.details[0].message });
      }

      let { id } = req.params;
      let found = await Order.findByPk(id);

      if (!found) {
         return res.status(404).json({ message: "Not found data" });
      }

      await found.update(value);

      res.status(200).json({ data: found });
   } catch (error) {
      res.status(500).json({ message: error.message });
   }
}

export async function getBySearch(req, res) {
   try {
      let query = {};
      for (let [key, val] of Object.entries(req.query)) {
         if (val) {
            query[key] = val;
         }
      }

      let { error, value } = orderSearchValid.validate(query);
      if (error) {
         return res.status(422).json({ message: error.details[0].message });
      }

      let orders = await Order.findAll({
         where: value,
         include: [User, OrderItems],
      });

      if (!orders.length) {
         return res.status(404).json({ message: "Not found data" });
      }

      res.status(200).json({ data: orders });
   } catch (error) {
      res.status(500).json({ message: error.message });
   }
}
