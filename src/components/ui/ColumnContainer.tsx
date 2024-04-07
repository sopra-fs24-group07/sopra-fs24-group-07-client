import React, { useMemo, useState } from "react";
import PropTypes from "prop-types";
import "../../styles/ui/ColumnContainer.scss";
import { Button } from "./Button";
import TaskCard from "./TaskCard";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { DndContext } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import CreateTask from "../popups/CreateTask";

function ColumnContainer(props) {
  //get the columns and tasks from props
  const { column, teamTasks } = props;
  //new Task that can be created
  const [newTask, setNewTask] = useState(null);
  //set State of Create Task Popup
  const [isCreateTaskOpen, setCreateTaskOpen] = useState(false);

  //open the Create Task Popup
  const openCreateTask = () => {
    setCreateTaskOpen(true);
  };

  //close the Create Task Popup
  const closeCreateTask = () => {
    setCreateTaskOpen(false);
  };

  return (
    <div className="col">
      <div>{column}</div> {/*name of the column*/}
      <div className="tasksArea">
        {teamTasks.map((task) => {
          if (task.status === column) {
            /*map the task in the column if it has the status of the column*/
          }
          return <TaskCard key={task.id} task={task} col={column}></TaskCard>;
        })}
      </div>
      {/*display the createTask button for the To-do coloumn*/}
      {column === "TODO" && (
        <div className="createTask container">
          <Button
            width="100%"
            className="createTask button"
            onClick={openCreateTask}
          >
            {/*open the create Task pop-up on click*/}
            Add Task
          </Button>
          <CreateTask isOpen={isCreateTaskOpen} onClose={closeCreateTask} />
        </div>
      )}
    </div>
  );
}

{
  /*check prop Types*/
}
ColumnContainer.propTypes = {
  column: PropTypes.string,
  teamTasks: PropTypes.array,
};

export default ColumnContainer;
