const express = require("express");
const app = express();
const connectDB = require("./config/db");

connectDB();

app.use(express.json());
app.get("/", (req, res) => {
  res.send("API is running");
});

app.use("/api/users", require("./routes/api/usersApi"));
app.use("/api/auth", require("./routes/api/authApi"));
app.use("/api/profile", require("./routes/api/profileApi"));

const PORT = process.env.PORT || 500;

app.listen(PORT, () => {
  console.log("Server running");
});
