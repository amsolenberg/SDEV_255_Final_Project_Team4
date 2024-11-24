const express = require("express");
const router = express.Router();
const argon2 = require("argon2");
const pg = require("pg");
const cors = require("cors");
require("dotenv").config();

router.use(cors());
router.use(express.json());

// PostgreSQL Connection
const db = new pg.Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT
});

// Routes
router.post("/register", async (req, res) => {
  const {
    first_name,
    last_name,
    email,
    password,
    user_type,
    major,
    department
  } = req.body;
  try {
    const hashedPassword = await argon2.hash(password);
    const userResult = await db.query(
      `INSERT INTO users (first_name, last_name, email, password, user_type) VALUES ($1, $2, $3, $4, $5) RETURNING id`,
      [first_name, last_name, email, hashedPassword, user_type]
    );

    const userId = userResult.rows[0].id;

    if (user_type === "student") {
      await db.query(`INSERT INTO students (user_id, major) VALUES ($1, $2)`, [
        userId,
        major
      ]);
    } else if (user_type === "faculty") {
      await db.query(
        `INSERT INTO faculty (user_id, department) VALUES ($1, $2)`,
        [userId, department]
      );
    }

    res.redirect("/login");
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).send("An error occurred during registration");
  }
});

router.get("/courses", async (req, res) => {
  try {
    const query = `
      SELECT 
        courses.id,
        courses.name,
        courses.code,
        courses.description,
        courses.credits,
        faculty.id AS faculty_id,
        faculty.department AS faculty_department,
        users.email AS faculty_email
      FROM 
        courses
      LEFT JOIN 
        faculty ON courses.faculty_id = faculty.id
      LEFT JOIN 
        users ON faculty.user_id = users.id
    `;
    const result = await db.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).send("Error fetching courses");
  }
});

module.exports = router;
