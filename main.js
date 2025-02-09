import express from "express";
import mainRoute from "./routes/index.js";
import { config } from "dotenv";
config();

const port = process.env.PORT;
const app = express();
app.use(express.json());

app.use("/api", mainRoute)

app.listen(port, () => console.log("Server started on port", port));
