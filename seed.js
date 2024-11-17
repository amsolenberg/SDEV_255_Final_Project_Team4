const db = require('./database');

db.serialize(() => {
    // Insert sample teachers
    db.run(`INSERT INTO teachers (name, department, email) VALUES (?, ?, ?)`, [
        'Ash Williams',
        'Computer Science',
        'groovy@deaditehunter.com',
    ]);
    db.run(`INSERT INTO teachers (name, department, email) VALUES (?, ?, ?)`, [
        'Clarence Worley',
        'Mathematics',
        'cworley@romancerun.com',
    ]);

    // Insert sample courses
    db.run(
        `INSERT INTO courses (name, code, description, credits, teacher_id) VALUES (?, ?, ?, ?, ?)`,
        ['Introduction to Programming', 'CS101', 'Learn the basics of programming.', 3, 1]
    );
    db.run(
        `INSERT INTO courses (name, code, description, credits, teacher_id) VALUES (?, ?, ?, ?, ?)`,
        ['Calculus I', 'MATH101', 'Introduction to calculus concepts.', 4, 2]
    );

    console.log('Sample data inserted.');
});

db.close();
