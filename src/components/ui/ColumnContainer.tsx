import React, { useMemo, useState } from "react";
import PropTypes from "prop-types";
import "../../styles/ui/ColumnContainer.scss";
import { Button } from "./Button";
import TaskCard from "./TaskCard";
import { useDroppable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import CreateTask from "../popups/CreateTask";

function ColumnContainer(props) {
  //get the columns and tasks from props
  const { column, teamTasks, sessionStatus } = props;
  //new Task that can be created
  const [newTask, setNewTask] = useState(null);
  //set State of Create Task Popup
  const [isCreateTaskOpen, setCreateTaskOpen] = useState(false);

  //dnd
  const { isOver, setNodeRef } = useDroppable({
    id: column,
  });
  const style = {
    color: isOver ? "green" : undefined,
  };

  //open the Create Task Popup
  const openCreateTask = () => {
    setCreateTaskOpen(true);
  };

  //close the Create Task Popup
  const closeCreateTask = () => {
    setCreateTaskOpen(false);
  };

  return (
    <div className="col" ref={setNodeRef} style={style}>
      <div className="colName">
        {column === "IN_SESSION" ? "NEXT SESSION" : column}
      </div>
      {/*name of the column*/}
      <div className="tasksArea">
        {teamTasks.map((task) => {
          if (task.status === column)
            return (
              <TaskCard
                key={task.id}
                task={task}
                col={column}
                sessionStatus={sessionStatus}
              />
            );
        })}
      </div>
      {/*display the createTask button for the To-do coloumn*/}
      {column === "TODO" && sessionStatus === "off" && (
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

/*check prop Types*/
ColumnContainer.propTypes = {
  column: PropTypes.string,
  teamTasks: PropTypes.array,
  sessionStatus: PropTypes.string,
};

export default ColumnContainer;
