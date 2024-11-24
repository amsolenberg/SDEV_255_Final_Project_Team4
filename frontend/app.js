const express = require("express");
const app = express();
const port = 8080;

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

app.get("/available-courses", async (req, res) => {
  try {
    const response = await fetch("http://backend:3000/api/courses");
    const courses = await response.json();

    res.render("available-courses", { title: "Courses", courses });
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).send("Could not load courses");
  }
});
