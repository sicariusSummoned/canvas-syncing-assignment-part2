const http = require('http');
const socketio = require('socket.io');

const fs = require('fs');

const serverDraws = {
  square: {
    x: 0,
    y: 0,
    width: 50,
    height: 50,
  },
};

const PORT = process.env.PORT || process.env.NODE_PORT || 3000;

const handler = (request, response) => {
  fs.readFile(`${__dirname}/../client/index.html`, (err, data) => {
    if (err) {
      throw err;
    }

    response.writeHead(200);
    response.write(data);
    response.end();
  });
};

const app = http.createServer(handler);
const io = socketio(app);

app.listen(PORT);

io.on('connection', (socket) => {
  socket.join('room1');
  console.log('User Joined');


  socket.on('newSquareCreated', (data) => {
    // 3. Server adds square to object of squares
    serverDraws[data.time] = data;


    console.log('Server updated Draws');
    console.dir(serverDraws);

    // 4. Server sends clients message about update
    io.sockets.in('room1').emit('updateDraws', serverDraws);
  });
});


console.log(`Listening on 127.0.0.1 ${PORT}`);
