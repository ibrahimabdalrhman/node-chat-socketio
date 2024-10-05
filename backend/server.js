const express = require("express");
const dotenv = require("dotenv");
dotenv.config({ path: ".env" });
const app = express();
const cors = require("cors");
app.use(cors());
const db = require("./config/db");
db();
app.use(express.json());
const ApiError = require("./utils/apiError");
const errorMiddleware = require("./middlewares/errorMiddleware");
const authRoute = require("./routes/authRoute");
const userRoute = require("./routes/userRoute");
const chatRoute = require("./routes/chatRoute");
const messageRoutes = require("./routes/messageRoute");
const adminRoute = require("./admin/adminRoute");

app.use("/api/admin", adminRoute);
app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/chat", chatRoute);
app.use("/api/messages", messageRoutes);

app.all("*", (req, res, next) => {
  next(new ApiError(`can't find this page ${req.url}`, 404));
});

//Global error middleware
app.use(errorMiddleware);

const port = process.env.PORT;
app.listen(port, () => console.log(`server running on port ${port}`));
