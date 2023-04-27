import React, { useState, useContext, useEffect } from 'react';
import { ProjectContext } from './ProjectContext.jsx';
// import './TaskContainer.css';
import { Box } from "@material-ui/core";
import TaskColumn from './TaskColumn.jsx';

//import beautiful dnd
import {
  DragDropContext,
  Droppable,
  Draggable,
} from 'react-beautiful-dnd';

export const TaskContainer2 = () => {
  // import userTasks from project context
  const { userTasks } = useContext(ProjectContext);
  console.log(`TASKCONTAINER2 type:`, Array.isArray(userTasks));
  console.log(`TASKCONTAINER2 userTasks:`, userTasks);
  console.log(`TASKCONTAINER2 type:`, Array.isArray(userTasks));


  // initiate local state of array of task columns
  const [taskColArr, setTaskColArr] = useState([]);
  return (
    <div className='TaskContainer'>
      <h1>Current Project</h1>

      {/* <dragdropcontext */}

      {/* <droppable */}

      <div className='columns-container' > 
        <div id='col-1'>
          <TaskColumn status={1} {...{ taskColArr, setTaskColArr, }} name='NEW'/>
        </div>
        <div id='col-2'>
          <TaskColumn status={2} {...{ taskColArr, setTaskColArr, }} name='IN PROGRESS'/>
        </div>
        <div id='col-3'>
          <TaskColumn status={3}  {...{ taskColArr, setTaskColArr, }} name='COMPLETED'/>
        </div>
      </div>
    </div>
  );
};
