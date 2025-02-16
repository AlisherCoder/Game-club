import mainRoute from "./routes/index.js";
import sequelize from "./config/database.js";
import express from "express";
import cors from "cors";
import { config } from "dotenv";
config();

const port = process.env.PORT;
const app = express();
app.use(express.json());
app.use(
   cors({
      origin: "*",
   })
);

async function Connect() {
   try {
      await sequelize.authenticate();
      // await sequelize.sync({ force: true });
      console.log("Connect db successfully");
      app.listen(port, () => console.log("Server started on port", port));
   } catch (error) {
      console.log(error.message);
   }
}
Connect();

app.use("/api", mainRoute);

app.use("/*", (req, res) => {
   res.status(500).json({ message: "Not found route" });
});
