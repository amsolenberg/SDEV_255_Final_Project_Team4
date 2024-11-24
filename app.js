const express = require("express");
const app = express();
const port = 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.set("view engine", "ejs");

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("index", { title: "Home" });
});

app.get("/login", (req, res) => {
  res.render("login", { title: "Login" });
});

app.get("/register", (req, res) => {
  res.render("register", { title: "Registration" });
});
