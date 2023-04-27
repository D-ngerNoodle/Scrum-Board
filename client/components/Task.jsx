import React, { useState, useContext } from 'react';
import { ProjectContext } from './ProjectContext.jsx';
import {
  DragDropContext,
  Droppable,
  Draggable,
} from 'react-beautiful-dnd';

//this is the doubleclick/deletebutton

const Task = ({ content, state, setState, index, taskName, status, id, key2 }) => {
  const { userTasks, setUserTasks } = useContext(ProjectContext);

  console.log(`keys are here `, key2)
  // hooks for title text edit field
  const [toggleTitle, setToggleTitle] = useState(true);
  const [taskTitle = 'title', setTaskTitle] = useState(taskName);

  // hooks for body text edit field
  //const [toggleBody, setToggleBody] = useState(true);
  //const [taskBody, setTaskBody] = useState('Body');

  // console.log('task state in task comp is: ', tasks)

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
      <button className='deleteButtonT'
          onClick={() => {
            // set the new state with all items that do not use that specific ID

            setUserTasks(userTasks.filter(el => el.key2 != key2));

            console.log(`userTasksssssss`,userTasks);

          }}
          ><i class="fa fa-trash" style={{ fontSize: '1.5rem' }}></i></button>

      </div>
    </article>
  );
};

export default Task;
