import React, { useState } from "react";
import PropTypes from "prop-types";
import "../../styles/ui/ColumnContainer.scss";
import { Button } from "./Button";
import TaskCard from "./TaskCard";
import { useDroppable } from "@dnd-kit/core";
import CreateTask from "../popups/CreateTask";
import InspectTask from "components/popups/InspectTask";

function ColumnContainer(props) {
  //get the columns and tasks from props
  const { column, teamTasks, sessionStatus, isDragged } = props;
  //new Task that can be created
  const [openTask, setOpenTask] = useState(null);
  //set State of Create Task Popup
  const [isCreateTaskOpen, setCreateTaskOpen] = useState(false);

  const [isInspectTaskOpen, setInspectTaskOpen] = useState(false);

  //open the Inspect Task Popup
  const openInspectTask = (task) => {
    setOpenTask(task);
    setInspectTaskOpen(true);
  };

  //close the Inspect Task Popup
  const closeInspectTask = () => {
    console.log("I WAS IN THERE");
    setInspectTaskOpen(false);
  };

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

  let dragStyle = { opacity: "1" };

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
          if (task.status === column) {
            if (task.taskId === isDragged) {
              dragStyle = { opacity: "0" };
            } else {
              dragStyle = { opacity: "1" };
            }

            return (
              <TaskCard
                openInspectTask={openInspectTask}
                key={task.id}
                task={task}
                col={column}
                sessionStatus={sessionStatus}
                dragStyle={dragStyle}
              />
            );
          }
        })}
      </div>
      {/*display the createTask button for the To-do coloumn*/}
      {column === "TODO" && sessionStatus === "off" && (
        <div className="createTask container">
          <Button
            className="green-button"
            width="100%"
            onClick={openCreateTask}
          >
            {/*open the create Task pop-up on click*/}
            Add Task
          </Button>
          <CreateTask isOpen={isCreateTaskOpen} onClose={closeCreateTask} />
        </div>
      )}
      {openTask && (
        <InspectTask
          isOpen={isInspectTaskOpen}
          onClose={closeInspectTask}
          task={openTask}
          inSession={false}
        />
      )}
    </div>
  );
}

/*check prop Types*/
ColumnContainer.propTypes = {
  column: PropTypes.string,
  teamTasks: PropTypes.array,
  sessionStatus: PropTypes.string,
  isDragged: PropTypes.string,
};

export default ColumnContainer;
