import db from "../config/db.js";
import { OrderValid } from "../validations/order.validation.js";

export async function getAll(req, res) {
   try {
      let [data] = await db.query("select * from orders");

      if (!data.length) {
         return res.status(200).json({ message: "No orders yet" });
      }

      res.status(200).json({ data });
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

      let { userId, totalSum, payStatus, payment, products } = value;
      let [created] = await db.execute(
         "insert into orders (userId,totalSum,payStatus,payment) values(?,?,?,?)",
         [userId, totalSum, payStatus, payment]
      );

      if (!products.length) {
         return res.status(422).json({ message: "Products cannot be empty" });
      }

      for (let prd of products) {
         let keys = Object.keys(prd);
         let values = Object.values(prd);

         keys.push("orderId");
         values.push(created.insertId);

         let query = keys.map((key) => "?");
         try {
            await db.execute(
               `insert into orderitems (${keys.join(",")})
                values (${query.join(",")})`,
               values
            );
         } catch (error) {
            return res.status(500).json({ message: error.message });
         }
      }

      let [found] = await db.execute("select * from orders where id = ?", [
         created.insertId,
      ]);

      res.status(201).json({ data: found[0] });
   } catch (error) {
      res.status(500).json({ message: error.message });
   }
}
