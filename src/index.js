import dotenv from "dotenv";
import connectDB from "./db/db.js";
import { app } from "./app.js";

dotenv.config({
  path: "./.env",
});

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 3005, () => {
      console.log(` Server is running on PORT: ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log(`Mongo DB Connection Failed`, err);
  });
