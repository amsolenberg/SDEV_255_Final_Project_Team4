const express = require('express');
const db = require('./database');
const app = express();
app.use(express.json());

const PORT = 3000;

app.get('/courses', (req, res) => {
    db.all('SELECT * FROM courses', [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

app.get('/courses/:id', (req, res) => {
    const { id } = req.params;
    db.get('SELECT * FROM courses WHERE id = ?', [id], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(row);
    });
});

app.post('/courses', (req, res) => {
    const { name, code, description, credits, teacher_id } = req.body;
    db.run(
        'INSERT INTO courses (name, code, description, credits, teacher_id) VALUES (?, ?, ?, ?, ?)',
        [name, code, description, credits, teacher_id],
        function (err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({ id: this.lastID });
        }
    );
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});