/* eslint-disable no-unused-vars */
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');

const { Server } = require('socket.io');
const connectDB = require('./database/index');
const routes = require('./routes');

const app = express();
const appServer = http.createServer(app);

// connect mongodb
connectDB();

function createApplication(httpServer, components, serverOptions = {}) {
  const io = new Server(httpServer, serverOptions);

  io.on('connection', (socket) => {
    console.log(`User Connected: ${socket.id}`);
    // socket.on('join_room', (payload) => {
    //   socket.join(payload.roomId);

    //   // return GameroomsRepository.stJoinRoom({ payload, socket });
    // });

    // socket.on('rooms_opened', (payload) =>
    //   // RoomsRepository.findAll({ payload, socket })
    // );

    // socket.on('participant_left_room', (payload) =>
    //   // ParticipantsRepository.stRemoveParticipant({ payload, socket })
    // );
  });

  return io;
}

const io = createApplication(
  appServer,
  {},
  {
    cors: {
      origin: '*',
    },
    methods: ['GET', 'POST'],
  }
);

app.use(cors());
app.use(express.json());
// eslint-disable-next-line no-unused-vars
app.use((error, req, res, next) => {
  console.log('Error Handler: ', error);
  res.sendStatus(500);
});

app.use((req, res, next) => {
  req.io = io;
  next();
});
app.use(routes);

const port = process.env.PORT || 8080;
appServer.listen(port, () =>
  console.log(`🔥 Server's running at port: ${port} 🔥`)
);
