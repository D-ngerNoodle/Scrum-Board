import React, { useState, useContext } from 'react';
import { ProjectContext } from './ProjectContext.jsx';
import {
  DragDropContext,
  Droppable,
  Draggable,
} from 'react-beautiful-dnd';

//this is the doubleclick/deletebutton

const Task = ({ content, state, setState, index, taskName, status, id, taskId}) => {
  const { userTasks, setUserTasks } = useContext(ProjectContext);

  //console.log(`keys are here `, taskID)
  // hooks for title text edit field
  const [toggleTitle, setToggleTitle] = useState(true);
  const [taskTitle = 'title', setTaskTitle] = useState(taskName);

  // hooks for body text edit field
  //const [toggleBody, setToggleBody] = useState(true);
  //const [taskBody, setTaskBody] = useState('Body');

  // handle delete task
  function handleDeleteTask () {
    fetch(`http://localhost:3000/tasks/${taskId}`, {
      method: 'DELETE'
    })
    .then(response => {
      if (response.ok) {
        // remove the task from the tasks array
        console.log('userTasks before: ', userTasks);
        const updatedTasks = userTasks.filter(user => user.id !== taskId);
        console.log('updatedTasks: ', updatedTasks);
        setUserTasks(updatedTasks);
        console.log('userTasks after: ', userTasks);
      } else {
        throw new Error('Failed to delete task');
      }
    })
    .catch(error => {
      console.error(error);
    });
  }

 // handle task name change
 const updateTaskName = async () => {
  try {
    const response = await fetch(`http://localhost:3000/tasks/${taskId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: taskId, name: taskTitle }),
    });
    if (!response.ok) {
      throw new Error('Failed to update item in database');
    }
  } catch (error) {
    console.error(error);
  }
};

  //console.log('task state in task comp is: ', tasks)

  return (
    <article className="taskBox" id={id}>
      <div className="content">
        {/* click to edit field for task title */}
        {toggleTitle ? (
          <p
            onDoubleClick={() => {
              setToggleTitle(false);
            }}
          >
            {taskTitle}
          </p>
        ) : (
          <input
            type="text"
            maxLength="70"
            value={taskTitle}
            onChange={event => {
              setTaskTitle(event.target.value);
            }}
            // on clickout
            onBlur={() => {
              setToggleTitle(true);
              // put request to change title to what's in input field
              updateTaskName();
            }}
            onKeyDown={event => {
              if (event.key === 'Enter' || event.key === 'Escape') {
                setToggleTitle(true);
                // put request to change title to what's in input field
                event.preventDefault();
                event.stopPropagation();
                updateTaskName();
              }
            }}
          />
        )}

        {/* click to edit field for task body */}
        {/* {toggleBody ? (
          <p
            onDoubleClick={() => {
              setToggleBody(false);
            }}
          >
            {taskBody}
          </p>
        ) : (
          <input
            type="text"
            value={taskBody}
            onChange={event => {
              setTaskBody(event.target.value);
            }}
            onBlur={() => {
              setToggleBody(true);
            }}
            onKeyDown={event => {
              if (event.key === 'Enter' || event.key === 'Escape') {
                setToggleBody(true);
                event.preventDefault();
                event.stopPropagation();
              }
            }}
          />
        )} */}

      </div>
      <div className="btn-container">
      <button className='deleteButtonT'
          onClick={() => {
            // set the new state with all items that do not use that specific ID

            handleDeleteTask()

            // setUserTasks(userTasks.filter(el => el.taskID != taskID));

            // console.log(`userTasksssssss`,userTasks);

          }}

          ><i class="fa fa-trash" style={{ fontSize: '1.5rem' }}></i></button>

      </div>
    </article>
  );
};

export default Task;
