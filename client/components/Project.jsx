import React, { useState } from 'react';

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

  // updates project title
  const updateName = async () => {
    try {
      const response = await fetch(`http://localhost:3000/projects/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: id, name: taskTitle }),
      });
      if (!response.ok) {
        throw new Error('Failed to update item in database');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="projectContainer">
      <div className="projectName">
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
            // potential future change for an update request to backend to ensure new project titles are saved
            //below vvv
            onBlur={() => {
              setToggleTitle(true);
              updateName();
            }}
            onKeyDown={event => {
              if (event.key === 'Enter' || event.key === 'Escape') {
                setToggleTitle(true);
                event.preventDefault();
                event.stopPropagation();
                updateName();
              }
            }}
          />
        )}
      </div>
          {/* delete button, it works! */}
      <div>
        <button className='deleteButton'
          onClick={deleteItem}
          ><i class="fa fa-trash" style={{ fontSize: '1.5rem' }}></i></button>
        {/* <button className='deleteButton'
          type="button"
          onClick={ 
          //   () => {
          //   console.log(id);
          //   setItems(items.filter(el => el.id != id));
          // }
             deleteItem
          }
        >
          X
        </button> */}
      </div>
    </div>
  );
};
