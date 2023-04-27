import React, { useState, useEffect, useContext } from 'react';
import Button from '@mui/material/Button';
import { ProjectContext } from './ProjectContext.jsx';
import Task from './Task.jsx';
import {
  DragDropContext,
  Droppable,
  Draggable,
} from 'react-beautiful-dnd';


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

  // handle task drop/status change
const updateTaskStatus = async () => {
  try {
    const response = await fetch(`http://localhost:3000/tasks/${taskId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: taskId, status: status }), // this is wrong
    });
    if (response.ok) {
      (renderState ? setRenderState(false) : setRenderState(true));
    }
  } catch (error) {
    console.error(error);
  }
};

  const taskSort = list => {
    const newList = [];
    for(let el of list){
      if(el.status === status) newList.push(el);
    }
    return newList;
  }

  
  // we need this to render through a component; 
  const taskRender = () => {
    const taskList = [];
    const newArr = taskSort(userTasks);
    
    for(let i = 0; i < newArr.length; i++){
      // if the current task status is equal to the specific column status
      // push it to the current column

      // error: invalid input syntax for type integer: "taskStatus1"
        taskList.push(
    <Draggable key={newArr[i].id} draggableId={`${newArr[i].id}`} index={i}>
      {(provided) => (
        <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
          <Task taskName={newArr[i].task_name} status={newArr[i].status} id={`taskStatus${newArr[i].status}`} 
          key={i} taskId={newArr[i].id}/>
        </div>
      )}
    </Draggable>);

    }
    setTasks(taskList);
  };

  //to run on changes to the second argument (state); needs this to render
  useEffect(() => {
    //setTasks(taskSort(userTasks));
    taskRender();
  }, [userTasks]);

  // handle add task

  const reorder = (list, startIndex, endIndex) => {
    console.log(`start:  ${startIndex}, end:  ${endIndex}`);
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };

  function onDragEnd(result) {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    console.log(result.source.index)
    // reorder the list
    const updatedTasks = reorder(
      taskSort(userTasks),
      result.source.index,
      result.destination.index
    );

    setTasks(updatedTasks);
  }

  // console.log('tasks is ', tasks);
  return (
    <Droppable droppableId={`column ${status}`} onDragEnd={onDragEnd}>
      {(provided) => (
      <div className="column" {...provided.droppableProps} ref={provided.innerRef}>
        <div className='columnStatus'>{name}</div>
        <div className="tasksBox">
          {tasks}
        </div>

        <div>
          {/* <button onClick={taskCreator}>New Task</button> */}
          <Button 
            className='MUIBUTTON'
            variant="contained" 
            sx={{ m: 1.5,
            boxShadow: 3,
            fontSize: 20, 
            background: '#6597a8f6',
            ":hover": {
              bgcolor: "#577f8df6",
            }}}
            style={{
              width: '120px',
              fontSize: '13px'
            }}
            onClick={taskCreator}
          >New Task</Button>
        </div>
      </div>
      )}
    </Droppable>
  )
};

export default TaskColumn;
