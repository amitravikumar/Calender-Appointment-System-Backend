if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const authMiddleware = require('./middleware/auth');

const config = require('./config');

const server = express();

server.use(bodyParser.json());
server.use(cors({ credentials: true}));
server.use(authMiddleware.initialize)

server.use([require('./routes/auth'), require('./routes/slots')])

server.use((error, req, res, next) => {
    res.json({
        error: {
            message: error,
        }
    })
})
server.listen(config.port, config.host, error => {
    if(error) {
        console.error('Error in starting', error)
    }else {
        console.info('Express listening to port', config.port)
    }
});