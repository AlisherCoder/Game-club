import Order from "../models/order.model.js";
import OrderItems from "../models/orderItems.model.js";
import User from "../models/user.model.js";
import { userSearchValid } from "../validations/search.valid.js";
import { UserPatchValid } from "../validations/user.validation.js";

export async function getAll(req, res) {
   try {
      let data = await User.findAll({
         include: { model: Order, include: OrderItems },
      });

      if (!data.length) {
         return res.status(200).json({ message: "No users yet" });
      }

      res.status(200).json({ data });
   } catch (error) {
      res.status(500).json({ message: error.message });
   }
}

export async function getOne(req, res) {
   try {
      let { id } = req.params;
      let found = await User.findByPk(id, {
         include: { model: Order, include: OrderItems },
      });

      if (!found) {
         return res.status(404).json({ message: "Not found data" });
      }

      res.status(200).json({ data: found });
   } catch (error) {
      res.status(500).json({ message: error.message });
   }
}

export async function remove(req, res) {
   try {
      let { id } = req.params;
      let found = await User.findByPk(id);

      if (!found) {
         return res.status(404).json({ message: "Not found data" });
      }
      await found.destroy();

      res.status(200).json({
         message: "User deleted successfully",
         data: found,
      });
   } catch (error) {
      res.status(500).json({ message: error.message });
   }
}

export async function update(req, res) {
   try {
      let { id } = req.params;
      let { error, value } = UserPatchValid.validate(req.body);

      if (error) {
         return res.status(422).json({ message: error.details[0].message });
      }

      let found = await User.findByPk(id);
      if (!found) {
         return res.status(404).json({ message: "Not found data" });
      }

      let { role, isActive } = value;
      if ((role || isActive) && req.user.role == "user") {
         return res
            .status(400)
            .json({ message: "Not allowed to updated isActive or role" });
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

      let { error, value } = userSearchValid.validate(query);
      if (error) {
         return res.status(422).json({ message: error.details[0].message });
      }

      let users = await User.findAll({
         where: value,
         include: { model: Order, include: OrderItems },
      });
      if (!users.length) {
         return res.status(404).json({ message: "Not found data" });
      }

      res.status(200).json({ data: users });
   } catch (error) {
      res.status(500).json({ message: error.message });
   }
}
