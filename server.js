const express = require('express');
const path = require('path');
const socket = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const tasks = [];

app.use(express.static(path.join(__dirname, '/client')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/client/src/App.js'));
});

const server = app.listen(process.env.PORT || 8000, () => {
  console.log('Server is running...');
});

const io = socket(server, {
  cors: { origin: "http://localhost:3000" }
});

io.on('connection', (socket) => {
  socket.emit('updateData', tasks);
  socket.on('addTask', (task) => {
    tasks.push(task);
    socket.broadcast.emit('updateData', tasks);
  });
  socket.on('removeTask', (deletedTaskId) => {
    tasks.forEach(task => {
      const index = tasks.indexOf(task);
      task.id === deletedTaskId && tasks.splice(index, 1);
    })
    socket.broadcast.emit('removeTask', deletedTaskId);
  });
});

app.use((req, res) => {
  res.status(404).send({ message: 'Not found...' });
});