import React, { useState, useEffect, useContext } from 'react';
// import Button from '@mui/material/Button';
import { ProjectContext } from './ProjectContext.jsx';
import Task from './Task.jsx';
// import {
//   DragDropContext,
//   Droppable,
//   Draggable,
// } from 'react-beautiful-dnd';


const TaskColumn = ({ taskInfo, name, status}) => {
  //create local state for number of tasks
  const { userTasks, renderState,  setRenderState } = useContext(ProjectContext);
  const [tasks, setTasks] = useState([]);

  //console.log('userTasks: ', userTasks);
  //function to create a task when the new task button is clicked
  // const taskCreator = () => {
  //   setTasks(
  //     tasks.concat(<Task taskInfo={taskInfo} status={status} key={tasks.length} key2={tasks.length} />)
  //   );
  //   // console.log('tasks is ', tasks);

  //console.log('status: ', status)

  const taskCreator = async () => {
    // make the POST request to the server

    console.log('status in try block is ', status);
    try{
      const response = await fetch('http://localhost:3000/tasks/', {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "name": 'New Task', // change this to the name of the new task
        "status": `${status}`,
        "project_id": `4`, // add the project ID here
      }),
    });

    // check if the request was successful
    if (response.ok) {
      //console.log(`status: ${status}`)
      (renderState ? setRenderState(false) : setRenderState(true));
      // retrieve the new task from the response
      // const newTask = await response.json();

      // add the new task to the userTasks array and update the state
      // setTasks([
      //   ...tasks,
      //   <Task taskName={newTask.task_name} status={newTask.status} key={newTask.id} taskId={newTask.id}/>
      // ]);
    }else {
      throw new Error('Failed to delete task from database');
    }
  } catch (error) {
    console.error(error);
  }
  };
  
  // we need this to render through a component; 
  const taskRender = () => {
    const taskList = [];
    for(let i = 0; i < userTasks.length; i++){
      // if the current task status is equal to the specific column status
      // push it to the current column

      // error: invalid input syntax for type integer: "taskStatus1"

      if(userTasks[i].status === status){
   taskList.push(<Task taskName={userTasks[i].task_name} status={userTasks[i].status} id={`taskStatus${userTasks[i].status}`} key={i} taskId={userTasks[i].id}/>);
      };

    }
    setTasks(taskList);
  };

  //to run on changes to the second argument (state); needs this to render
  useEffect(() => {
    setTasks(userTasks);
    taskRender();
  }, [userTasks]);

  // handle add task



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
