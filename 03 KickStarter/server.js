// Required for dynamic routing

const next = require('next');
const { createServer } = require('http');
const routes = require('./routes');

const app = next({ dev: process.env.NODE_ENV !== 'production' });
const handler = routes.getRequestHandler(app);

app.prepare().then(() => {
    createServer(handler).listen(3000, err => {
        if (err) throw err;
        console.log('Server started at localhost:3000!')
    });
});