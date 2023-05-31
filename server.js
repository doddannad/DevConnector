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
app.use("/api/post", require("./routes/api/postApi"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server running");
});
