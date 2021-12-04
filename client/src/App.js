import React from "react";
import { io } from "socket.io-client";
import { v4 as uuidv4 } from 'uuid';

class App extends React.Component {

  constructor() {
    super()
    const socket = io("http://localhost:8000");

    this.socket = socket;
    this.state = {
      tasks: [],
      taskName: ''
    }
  }

  

  componentDidMount(){
    this.socket.on('removeTask', (taskId) => {
      this.removeTask(taskId, 'server');
    })
    this.socket.on('addTask', (task) => {
      this.addTask(task);
    })
    this.socket.on('updateData', (tasks) => {
      this.setState({tasks: tasks});
    })
  }
  removeTask(taskId, server){
    const filteredTasks = this.state.tasks;
    filteredTasks.filter(task => {
      const index = filteredTasks.indexOf(task);
      task.id === taskId && filteredTasks.splice(index, 1);
    })
    this.setState({
      tasks: filteredTasks
    })
    if(server === 'self') this.socket.emit('removeTask', taskId);
    this.inputClear()
  }
  addTask(taskName){
    const task = {id: uuidv4(), name: taskName}
    const actualTasks = [...this.state.tasks, task];
    this.setState({
      tasks: actualTasks
    });
    this.socket.emit('addTask', task);
    this.inputClear()
  }
  submitForm(e){
    e.preventDefault();

    this.addTask(this.state.taskName);
    this.inputClear()
  }
  inputClear(){
    this.setState({
      taskName: ''
    })
  }

  render() {
    const tasks = this.state.tasks;

    return (
      <div className="App">
        <header>
          <h1>ToDoList.app</h1>
        </header>

        <section className="tasks-section" id="tasks-section">
          <h2>Tasks</h2>

          <ul className="tasks-section__list" id="tasks-list">
            {tasks && tasks.map(task => {
              return (
                <li className="task">
                  {task.name} <button className="btn btn--red" onClick={() => this.removeTask(task.id, 'self')}>Remove</button>
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
