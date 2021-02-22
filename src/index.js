// Our files
const server = require('./server.js');

// initializing express-session middleware
var Session = require('express-session');
var SessionStore = require('session-file-store')(Session);
var session = Session({store: new SessionStore({path: __dirname+'/tmp/sessions'}), secret: 'pass', resave: true, saveUninitialized: true});

// create express app
var express = require('express');
var app = express();
app.use(session);

// Pages
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get('/room/:code', (req, res) => {
  res.sendFile(__dirname + '/room.html');
});

// Attach express app to server
const PORT = process.env.PORT || 3000;
var http = require('http');
var httpserver = http.createServer(app);
httpserver.listen(PORT, () => {
  console.log('listening on *:3000');
});

// create new socket.io app
var ios = require('socket.io-express-session');
var io = require('socket.io')(httpserver);
io.use(ios(session)); // session support

// initialize server
server.init(io);

io.on('connection', (socket) => {
  server.initSocket(socket);
});
