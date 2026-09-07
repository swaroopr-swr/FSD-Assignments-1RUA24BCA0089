import React, { useState } from 'react';

const Todo = () => {
  const [tasks, setTasks] = useState([]);
  const [inputValue, setInputValue] = useState('');

  const addTask = () => {
    if (inputValue.trim() !== '') {
      setTasks([...tasks, { id: Date.now(), text: inputValue }]);
      setInputValue(''); // clear input
    }
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  return (
    <div className="lab-component">
      <h3>Todo List Component</h3>
      <div className="todo-input-group">
        <input 
          type="text" 
          value={inputValue} 
          onChange={(e) => setInputValue(e.target.value)} 
          placeholder="New task..."
        />
        <button className="btn-primary" onClick={addTask}>Add</button>
      </div>
      <ul className="todo-list">
        {tasks.map(task => (
          <li key={task.id}>
            {task.text}
            <button className="btn-danger" onClick={() => deleteTask(task.id)}>X</button>
          </li>
        ))}
        {tasks.length === 0 && <p>No tasks yet.</p>}
      </ul>
    </div>
  );
};

export default Todo;
