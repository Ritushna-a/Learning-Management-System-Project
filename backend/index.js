const express = require("express");
const cors = require("cors");
const { connectDB, sequelize } = require("./database/Database");

const app = express();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use("/uploads",express.static("uploads"));

app.use("/api/user", require("./routes/userRoute"));
app.use("/api/course", require("./routes/courseRoute"));

app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Home page" });
});

const startServer = async () => {
  await connectDB();
  await sequelize.sync();
  app.listen(5000, () => {
    console.log(`Server running on port ${5000}`);
  });
};

startServer();