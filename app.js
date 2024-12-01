const express = require('express');
// const dotenv = require('dotenv');
const path = require('path');

const connectToDB = require('./db');
const configureMiddlewares = require('./middlewares');
const routes = require('./routes');

const app = express();
const port = 3000;

// const result = dotenv.config();

// if (result.error) {
//     console.error('Failed to load .env file:', result.error);
//     process.exit(1);
// } else {
//     console.log('Loaded environment variables from .env');
// }

// const requiredVars = ['DB_HOST', 'DB_USER', 'DB_PASS', 'DB_NAME', 'SESSION_SECRET'];
// const missingVars = requiredVars.filter((key) => !process.env[key]);
// if (missingVars.length > 0) {
//     console.error(
//         `Missing required environment variables: ${missingVars.join(', ')}`
//     );
//     process.exit(1);
// }

configureMiddlewares(app);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

connectToDB()
    .then(() => {
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    })
    .catch((err) => {
        console.error('Failed to start the server:', err);
    });

app.use('/', routes);

app.use((req, res) => {
    res.status(404).render('404', {title: '404'});
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).send('Something went wrong!');
});
