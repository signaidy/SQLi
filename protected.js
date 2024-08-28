const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();

const db = new sqlite3.Database(':memory:');

app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send(`
        <form method="POST" action="/login">
            <label>Usuario:</label>
            <input type="text" name="username" />
            <label>Contraseña:</label>
            <input type="password" name="password" />
            <button type="submit">Iniciar Sesión</button>
        </form>
    `);
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Consulta SQL protegida usando declaraciones preparadas
    const query = `SELECT username FROM users WHERE username = ? AND password = ?`;
    
    db.all(query, [username, password], (err, rows) => {
        if (err) {
            return res.send('Error en la base de datos');
        }
        if (rows.length > 0) {
            res.send(`Bienvenido, ${username}`);
        } else {
            res.send('Usuario o contraseña incorrectos');
        }
    });
});

db.serialize(() => {
    db.run(`CREATE TABLE users (id INTEGER PRIMARY KEY, username TEXT, password TEXT)`);
    db.run(`INSERT INTO users (username, password) VALUES ('admin', 'admin123')`);
    db.run(`INSERT INTO users (username, password) VALUES ('user1', 'password1')`);
    db.run(`INSERT INTO users (username, password) VALUES ('user2', 'password2')`);
    db.run(`INSERT INTO users (username, password) VALUES ('user3', 'password3')`);
});

module.exports = app;