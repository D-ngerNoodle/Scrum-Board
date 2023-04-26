import React, { useState } from 'react';
import './Project.css';

export const Project = ({ content, items, setItems, index, id }) => {
  const [toggleTitle, setToggleTitle] = useState(true);
  const [taskTitle, setTaskTitle] = useState(content);
  // console.log('props.id: ', props.id);

  // deletes specific project from db based on id
  const deleteItem = async () => {
    try {
      const response = await fetch(`http://localhost:3000/projects/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        // removes the item from the state
        setItems(items.filter(el => el.id != id));
      } else {
        throw new Error('Failed to delete item from database');
      }
    } catch (error) {
      console.error(error);
    }
  };

  // updates project name on input change
  const changeName = async () => {
    // try {
    //   const response = await fetch(`http://localhost:3000/projects/${id}`, {
    //     method: 'PUT',
    //   });
    //   if (response.ok) {

    //   }
    // }
  }

  return (
    <div className="projectContainer">
      <div className="projectContent">
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
      </div>

      <div>
        <button
          type="button"
          onClick={ 
          //   () => {
          //   console.log(id);
          //   setItems(items.filter(el => el.id != id));
          // }
             deleteItem
          }
        >
          Delete
        </button>
      </div>
    </div>
  );
};
