CREATE TABLE
    teachers (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100),
        department VARCHAR(100),
        email VARCHAR(100)
    );

CREATE TABLE
    courses (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100),
        code VARCHAR(50),
        description TEXT,
        credits INT
    );