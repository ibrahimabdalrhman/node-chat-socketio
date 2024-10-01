const express = require("express");
const dotenv = require("dotenv");
dotenv.config({ path: ".env" });
const app = express();
const cors = require("cors");
app.use(cors());
const db = require("./config/db");
db();
const userRoute = require("./routes/userRoute");
app.use(express.json());
app.use("/api/user", userRoute);

const port = process.env.PORT;
app.listen(port, () => console.log(`server running on port ${port}`));
