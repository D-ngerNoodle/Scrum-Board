import React, { useState, useContext } from 'react';
import { ProjectContext } from './ProjectContext.jsx';
import {
  DragDropContext,
  Droppable,
  Draggable,
} from 'react-beautiful-dnd';

//this is the doubleclick/deletebutton

const Task = ({ content, state, setState, key, index, taskName, status, tasks, setTasks, id }) => {
  // hooks for title text edit field
  const [toggleTitle, setToggleTitle] = useState(true);
  const [taskTitle = 'title', setTaskTitle] = useState(taskName);

  // hooks for body text edit field
  //const [toggleBody, setToggleBody] = useState(true);
  //const [taskBody, setTaskBody] = useState('Body');

  console.log('task state in task comp is: ', tasks)

  return (
    <article className="taskBox">
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
            value={taskTitle}
            onChange={event => {
              setTaskTitle(event.target.value);
            }}
            onBlur={() => {
              setToggleTitle(true);
            }}
            onKeyDown={event => {
              if (event.key === 'Enter' || event.key === 'Escape') {
                setToggleTitle(true);
                event.preventDefault();
                event.stopPropagation();
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
      <button className='deleteButton'
          onClick={() => {
            // set the new state with all items that do not use that specific ID
            
            const holder = tasks.filter(el => el.id != id);
            const newArr =[];

            for(let i = 0; i < holder; i++){
              newArr.push(<Task taskName={holder[i].task_name} status={holder[i].status} tasks={holder} setTasks={setTasks} />)
            }
            setTasks(newArr);

          }}
          ><i class="fa fa-trash" style={{ fontSize: '1.5rem' }}></i></button>

      </div>
    </article>
  );
};

export default Task;
