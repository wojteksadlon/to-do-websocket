import React from "react";
import { io } from "socket.io-client";

class App extends React.Component {

  constructor() {
    super()
    const socket = io("http://localhost:8000");

    this.socket = socket
  }

  state = {
    tasks: [],
    taskName: ''
  }

  componentDidMount(){
    this.socket.on('removeTask', (task) => {
      this.removeTask(task, 'server');
    })
    this.socket.on('addTask', (task) => {
      this.addTask(task);
    })
    this.socket.on('updateData', (tasks) => {
      this.setState({tasks: tasks})
    })
  }
  removeTask(task, server){
    this.state.tasks.splice(task, 1);
    if(server === 'self') this.socket.emit('removeTask', task);
  }
  addTask(task){
    this.state.tasks.push(task);
  }
  submitForm(e){
    e.preventDefault();

    this.addTask(this.state.taskName);
    this.socket.emit('addTask', this.state.taskName);
  }

  render() {
    return (
      <div className="App">
        <header>
          <h1>ToDoList.app</h1>
        </header>

        <section className="tasks-section" id="tasks-section">
          <h2>Tasks</h2>

          <ul className="tasks-section__list" id="tasks-list">
            {this.state.tasks.map(task => {
              return (
                <li class="task">
                  {task} <button className="btn btn--red" onClick={this.removeTask(task.indexOf(), 'self')}>Remove</button>
                </li>
              )
            })}
          </ul>

          <form id="add-task-form">
            <input
              className="text-input"
              autoComplete="off"
              type="text"
              placeholder="Type your description"
              id="task-name"
              value={this.state.taskName}
              onChange={(e) => this.setState({taskName: e.target.value})}
            />
            <button className="btn" type="submit" onClick={(e) => this.submitForm(e)}>
              Add
            </button>
          </form>
        </section>
      </div>
    );
  }
}

export default App;
