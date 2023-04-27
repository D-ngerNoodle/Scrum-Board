import React, { useState, useContext, useEffect } from 'react';
import { ProjectContext } from './ProjectContext.jsx';
import { Project } from './Project.jsx';
import {
  DragDropContext,
  Droppable,
  Draggable,
} from 'react-beautiful-dnd';
import { v4 as uuid } from 'uuid'; // create unique id

export const ProjectContainer = () => {
  //userProjects and userTasks holds all project data and task data respectively
  const { userProjects, userTasks, renderState,  setRenderState } = useContext(ProjectContext);

  const test = [
    {
      id: '1',
      content: 'scrum board',
    },
  ];

  // check to see if props are being console logged
 //console.log('userProjects: ', userProjects, 'userTasks: ', userTasks);

  /* example
  userrProjects = [
    { name: 'scrum board' ,
      id: 23234 },
    { name: 'test' ,
    id: 2343454 },
    { name: 'project 3' ,
    id: 2334534534 }
  ]
  */

  // populate array of projects
  const initializeArr = () => {
    console.log('userProjects: ', userProjects);
    const result = userProjects.map(project => ({
      id: project.id,
      dId: uuid(),
      content: project.name,
    }));
    // result = {id: , content: }
   // console.log('this is result in initialize arr: ', result);
    return result;
  };

  // setInit(initializeArr());
  // default state  update state
  //first element is variable declared based off state, second is function used to update 
  const [items, setItems] = useState([]);  // items refers to individual tasks in a project

  //any time userProjects is updated, the component will rerender
  useEffect(() => {
    const result = initializeArr();
    setItems(result);
  }, [userProjects]);
  //console.log('this is the item in items: ', items);


  // helper function to reorder the result
  //this is used in the drag n drop feature
  const reorder = (list, startIndex, endIndex) => {
    console.log(`start:  ${startIndex}, end:  ${endIndex}`);
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };
  const grid = 8; // gap spacing

  //drag n drop styling
  const getItemStyle = (isDragging, draggableStyle) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: 'none',
    padding: grid * 2,
    margin: `0 0 ${grid}px 0`,
    display: 'flex',
    justifyContent: 'space-between',
    border: 'solid rgba(0, 0, 0, 0.228) 3px',
    borderRadius: '6px',
    color: 'rgba(0, 0, 0, 0.756)',
    // alignItems: 'center',

    // change background colour if dragging
    background: isDragging ? '#EBC1EE' : 'whitesmoke',

    // styles we need to apply on draggables
    ...draggableStyle,
  });

  //more drag n drop styling, changes dropable area to light blue
  const getListStyle = isDraggingOver => ({
    // background: isDraggingOver ? 'red' : 'lightblue',
    padding: grid,
    width: '280px',
  });

  // the list of projects
  // const [items, setItems] = useState(getItems());

  //console.log('items: ', items);

  //this updates the project array based on where the item was dropped in the UI
  function onDragEnd(result) {
    // dropped outside the list
    if (!result.destination) {
      return;
    }
    // reorder the list
    const updatedItems = reorder(
      items,
      result.source.index,
      result.destination.index
    );

    setItems(updatedItems);
  }


  // adds new project to database
  // ERRORS: need to somehow 
  const handleAddProject = async () => {
    try {
      const response = await fetch(`http://localhost:3000/projects/`, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "user_id": "5",
          "name": `New Project ${items.length + 1}`
        })
      });
      if (response.ok) {
       (renderState ? setRenderState(false) : setRenderState(true));
    //         const newProject = {
    //   user_id: 5, 
    //   name: `Project ${items.length + 1}`,
    //   // id: **need to grab new project id, but that requires context to rerender, not sure how to get that to happen without infinite loop**
    // };
    // const updatedItems = [...userProjects, newProject]; // add the new project to the items array
    // setUserProjects(updatedItems);
      } else {
        throw new Error('Failed to add item to database');
      }
    } catch (error) {
      console.error(error);
    };

    // const newProject = {
    //   id: uuid(), // generate a unique ID for the new project
    //   content: `Project ${items.length + 1}`,
    // };
    // const updatedItems = [...items, newProject]; // add the new project to the items array
    // setItems(updatedItems);
  };

  return (
    <div className='ProjectContainer'>
      <div className="outer">
        <div className="topBarContainer">
          <div className='topLeftContainer'>
            <div
              id="image-container"
              className='image-container'
            ></div>
            <div className='Username'>User</div>
            <form className='form'>
              <input
                type="file"
                id="image-upload"
                className='image-input'
                onChange={event => {
                  const file = event.target.files[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = e => {
                      const imageContainer =
                        document.getElementById('image-container');
                      imageContainer.style.backgroundImage = `url(${e.target.result})`;
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
            </form>
          </div>
        </div>

        <div className="project_Container">
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="droppable">
              {(provided, snapshot) => (
                <div
                  className='allProjects'
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  style={getListStyle(snapshot.isDraggingOver)}
                >
                  {items.map((item, index) => (
                    <Draggable
                      key={item.dId}
                      draggableId={item.dId}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          className='singleProjectUnit'
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={getItemStyle(
                            snapshot.isDragging,
                            provided.draggableProps.style
                          )}
                        >
                          <Project
                            className='Project'
                            key={index}
                            items={items}
                            setItems={setItems}
                            index={index}
                            content={item.content}
                            id={item.id}
                          />
                          {/* <div>{item.content}</div>
                          <button
                            type="button"
                            onClick={() => {
                              setItems(
                                items.filter(el => el.id != item.id)
                              );
                            }}
                          >
                            delete
                          </button> */}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
            {/* {arrContainer} */}
          </DragDropContext>
        </div>
        <button
          className='newProjectBtn'
          onClick={handleAddProject}
        >
          New Project
        </button>
      </div>
    </div>
  );
};
