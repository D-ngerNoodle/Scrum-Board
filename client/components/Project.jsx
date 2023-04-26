import React, { useState } from 'react';

export const Project = ({ content, items, setItems, index, id }) => {
  const [toggleTitle, setToggleTitle] = useState(true);
  const [taskTitle, setTaskTitle] = useState(content);

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
          {/* delete button, it works! */}
      <div>
        <button className='deleteButton'
          onClick={() => {
            setItems(items.filter(el => el.id != id));
          }}
          ><i class="fa fa-trash" style={{ fontSize: '1.5rem' }}></i></button>
        {/* <button className='deleteButton'
          type="button"
          onClick={() => {
            setItems(items.filter(el => el.id != id));
          }}
        >
          X
        </button> */}
      </div>
    </div>
  );
};
