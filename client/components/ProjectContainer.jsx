import React, { useState, useContext, useEffect } from 'react';
import { ProjectContext } from './ProjectContext.jsx';
import { Project } from './Project.jsx';
import {
  DragDropContext,
  Droppable,
  Draggable,
} from 'react-beautiful-dnd';
import { v4 as uuid } from 'uuid'; // creat unique id

export const ProjectContainer = () => {
  //userProjects and userTasks holds all project data and task data respectively
  const { userProjects, userTasks } = useContext(ProjectContext);

  const test = [
    {
      id: '1',
      content: 'scrum board',
    },
  ];

  console.log('userProjects: ', userProjects, 'userTasks: ', userTasks);

  // populate array of projects
  const initializeArr = () => {
    const result = userProjects.map(project => ({
      id: uuid(),
      content: project.name,
    }));
    console.log('this is result in initialize arr: ', result);
    return result;
  };

  // setInit(initializeArr());

  const [items, setItems] = useState([]);

  useEffect(() => {
    const result = initializeArr();
    setItems(result);
  }, [userProjects]);
  console.log('this is the item in items: ', items);

  // useEffect(() => {
  //   setInit(initializeArr());
  // }, [initItems]);

  // useEffect(() => {}, []);

  // const getItems = (count, offset = 0) =>
  //   Array.from({ length: count }, (v, k) => k).map(k => ({
  //     id: `item-${k + offset}-${new Date().getTime()}`,
  //     content: `Project  ${k + offset}`,
  //   }));

  // helper function to reorder the result
  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };
  const grid = 8; // gap spacing

  const getItemStyle = (isDragging, draggableStyle) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: 'none',
    padding: grid * 1,
    margin: `0 0 ${grid}px 0`,
    display: 'flex',
    justifyContent: 'space-between',
    border: 'solid black 1px',
    borderRadius: '6px',
    // alignItems: 'center',

    // change background colour if dragging
    background: isDragging ? '#EBC1EE' : 'whitesmoke',

    // styles we need to apply on draggables
    ...draggableStyle,
  });

  const getListStyle = isDraggingOver => ({
    // background: isDraggingOver ? 'red' : 'lightblue',
    padding: grid,
    width: '280px',
  });

  // the list of projects
  // const [items, setItems] = useState(getItems());

  console.log('items: ', items);

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

  const handleAddProject = () => {
    const newProject = {
      id: uuid(), // generate a unique ID for the new project
      content: `Project ${items.length + 1}`,
    };
    const updatedItems = [...items, newProject]; // add the new project to the items array
    setItems(updatedItems);
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
            <div>User</div>
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
                      key={item.id}
                      draggableId={item.id}
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
          onClick={() => {
            setItems(handleAddProject);
          }}
        >
          New Project
        </button>
      </div>
    </div>
  );
};
