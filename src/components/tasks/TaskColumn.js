import React from 'react';
import TaskCard from './TaskCard';
import "./TasksBoard.css";

function TaskColumn({ title, tasks }) {
 

  return (
    <div className="task-column">
      <h2>{title}</h2>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            <TaskCard title={task.title} priority={task.priority} taskId={task.id} state={task.state} creator={task.creator} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TaskColumn;
