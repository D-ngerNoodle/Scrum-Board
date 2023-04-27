import React, { useState, useEffect, useContext } from 'react';
// import Button from '@mui/material/Button';
import { ProjectContext } from './ProjectContext.jsx';
import Task from './Task.jsx';
// import {
//   DragDropContext,
//   Droppable,
//   Draggable,
// } from 'react-beautiful-dnd';


const TaskColumn = ({ taskInfo, id, name, status}) => {
  //create local state for number of tasks
  const { userTasks } = useContext(ProjectContext);
  const [tasks, setTasks] = useState([]);

  //console.log('userTasks: ', userTasks);
  //function to create a task when the new task button is clicked
  const taskCreator = () => {
    setTasks(
      tasks.concat(<Task taskInfo={taskInfo} tasks={userTasks} setTasks={setTasks} key={tasks.length} />)
    );
    // console.log('tasks is ', tasks);
  };
  
  // we need this to render through a component; 
  const taskRender = () => {
    const taskList = [];
    for(let i = 0; i < userTasks.length; i++){
      // if the current task status is equal to the specific column status
      // push it to the current column
      if(userTasks[i].status === status){
      taskList.push(<Task taskName={userTasks[i].task_name} status={userTasks[i].status} tasks={userTasks} setTasks={setTasks} key={i} />)
      };

    }
    setTasks(taskList);
  };

  //to run on changes to the second argument (state); needs this to render
  useEffect(() => {
    setTasks(userTasks);
    taskRender();
  }, [userTasks]);

  // console.log('tasks is ', tasks);
  return (
    <div className="column">
      <div className='columnStatus'>{name}</div>
      <div className="tasksBox">
        {tasks}
      </div>

      <div>
        <button onClick={taskCreator}>New Task</button>
        {/* <Button variant="contained" 
                sx={{ m: 1.5,
                  boxShadow: 1,
                  fontSize: 20, 
                  background: '#6a8f8b',
                  ":hover": {
                    bgcolor: "#4b6260",
                  }}}
                onClick={taskCreator}>New Task</Button> */}
      </div>
    </div>
  );
};

export default TaskColumn;
