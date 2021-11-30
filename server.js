const express = require('express');
const path = require('path');
const socket = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const tasks = [];

app.use(express.static(path.join(__dirname, '/client')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/client/src/index.js'));
});

const server = app.listen(process.env.PORT || 8000, () => {
  console.log('Server is running...');
});

const io = socket(server);

io.on('connection', (socket) => {
  socket.id.emit('updateData', tasks);
  socket.on('addTask', (task) => {
    tasks.push(task);
    socket.broadcast.emit('addTask', task);
  });
  socket.on('removeTask', (deletedTaskIndex) => {
    tasks.splice(deletedTaskIndex, 1);
    socket.broadcast.emit('removeTask', deletedTaskIndex);
  });
});

app.use((req, res) => {
  res.status(404).send({ message: 'Not found...' });
});