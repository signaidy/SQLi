const http = require('http');
const mode = process.env.MODE || 'vulnerable';
let app;

if (mode === 'protected') {
    app = require('./protected');
} else {
    app = require('./vulnerable');
}

const server = http.createServer(app);

server.listen(3000, () => {
    console.log(`Servidor iniciado en modo ${mode} en http://localhost:3000`);
});
