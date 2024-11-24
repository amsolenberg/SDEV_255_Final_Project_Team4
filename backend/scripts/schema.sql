CREATE TABLE
    users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password TEXT NOT NULL,
        user_type VARCHAR(10) CHECK (user_type IN ('student', 'faculty')) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW ()
    );

CREATE TABLE
    students (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users (id) ON DELETE CASCADE,
        major VARCHAR(100),
        enrollment_date DATE DEFAULT NOW ()
    );

CREATE TABLE
    faculty (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users (id) ON DELETE CASCADE,
        department VARCHAR(100),
        hire_date DATE DEFAULT NOW ()
    );

CREATE TABLE
    courses (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        code VARCHAR(20) UNIQUE NOT NULL,
        description TEXT,
        credits INT NOT NULL,
        faculty_id INT REFERENCES faculty (id) ON DELETE SET NULL
    );

CREATE TABLE
    enrollments (
        id SERIAL PRIMARY KEY,
        student_id INT REFERENCES students (id) ON DELETE CASCADE,
        course_id INT REFERENCES courses (id) ON DELETE CASCADE,
        enrolled_at TIMESTAMP DEFAULT NOW ()
    );