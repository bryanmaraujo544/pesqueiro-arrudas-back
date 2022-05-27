require('dotenv').config();
const express = require('express');
const routes = require('./routes');
const cors = require('cors');
const http = require('http');

const connectDB = require('./database/index');
const { Server } = require('socket.io');

const app = express();
const appServer = http.createServer(app);

// connect mongodb
connectDB();

app.use(cors());
app.use(express.json());
app.use((error, req, res, next) => {
  console.log('Error Handler: ', error);
  res.sendStatus(500);
});
app.use(routes);

const port = process.env.PORT || 8080;
appServer.listen(port, () => console.log("🔥 Server's running 🔥"));
