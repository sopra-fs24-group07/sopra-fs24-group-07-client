import React from "react";
import PropTypes from "prop-types";
import { api, handleError } from "helpers/api";
import "../../styles/ui/TaskCard.scss";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "./Button";
import { useParams } from "react-router-dom";

function TaskCard(props) {
  const { task, col } = props;
  const { teamId } = useParams();
  const taskId = task.id;

  //handle if a Task is moved to column to the right
  async function updateTaskStatusRight(task, col) {
    //from to-do to session
    if (col === "TODO") {
      task.status = "IN_SESSION";
    } else if (col === "IN_SESSION") {
      //from session to done
      task.status = "DONE";
    }
    //make api call to update status
    //TODO maybe fix api call when endpoint is ready
    try {
      const requestBody = JSON.stringify(task);
      const response = await api.put(
        `/api/v1/teams/${teamId}/tasks/${taskId}`,
        requestBody
      );
    } catch (error) {
      console.error(`Failed to Update Task error ${handleError(error)}`);
    }
  }

  //handle if a Task is moved to column to the left
  async function updateTaskStatusLeft(task, col) {
    //from session to to-do
    if (col === "IN_SESSION") {
      task.status = "TODO";
    } else if (col === "DONE") {
      //from done to session
      task.status = "IN_SESSION";
    }
    //make api call to update status
    //TODO maybe fix api call when endpoint is ready
    try {
      const requestBody = JSON.stringify(task);
      const response = await api.put(
        `/api/v1/teams/${teamId}/tasks/${taskId}`,
        requestBody
      );
    } catch (error) {
      console.error(`Failed to Update Task error ${handleError(error)}`);
    }
  }

  return (
    <div className="taskContainer">
      {/*create the go Left button for Tasks in Done and In Session */}
      {(col === "DONE" || col === "IN_SESSION") && (
        <Button
          className="goLeft"
          onClick={() => updateTaskStatusLeft(task, col)}
        >
          &lt;
        </Button>
      )}
      <div className="taskTitle">{task.title}</div>
      {/*create the go Right button for Tasks in To-do and In Session */}
      {(col === "TODO" || col === "IN_SESSION") && (
        <Button
          className="goRight"
          onClick={() => updateTaskStatusRight(task, col)}
        >
          &gt;
        </Button>
      )}
    </div>
  );
}

//check prop types
TaskCard.propTypes = {
  task: PropTypes.object,
  col: PropTypes.string,
};

export default TaskCard;
