const express = require("express");
const app = express();
const port = 8080;
const backendRouter = require("../backend/server");
app.use("/api", backendRouter);

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
    const response = await fetch(
      `${req.protocol}://${req.headers.host}/api/courses`
    );
    const courses = await response.json();

    res.render("available-courses", { title: "Courses", courses, error: null });
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.render("available-courses", {
      title: "Courses",
      courses: [],
      error: "Could not load courses at this time. Please try again later."
    });
  }
});
