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

  async function updateTaskStatusRight(task, col) {
    if (col === "TODO") {
      task.status = "IN_SESSION";
    } else if (col === "IN_SESSION") {
      task.status = "DONE";
    }
    try {
      const requestBody = JSON.stringify(task);
      const response = await api.put(
        `/api/v1/teams/${teamId}/tasks/${taskId}`,
        requestBody
      );
    } catch (error) {
      console.log("Failed to Update Task");
    }
  }

  async function updateTaskStatusLeft(task, col) {
    if (col === "IN_SESSION") {
      task.status = "TODO";
    } else if (col === "DONE") {
      task.status = "IN_SESSION";
    }
    try {
      const requestBody = JSON.stringify(task);
      const response = await api.put(
        `/api/v1/teams/${teamId}/tasks/${taskId}`,
        requestBody
      );
    } catch (error) {
      console.log("Failed to Update Task");
    }
  }

  return (
    <div className="taskContainer">
      {col === "DONE" && (
        <Button
          className="goLeft"
          onClick={() => updateTaskStatusLeft(task, col)}
        ></Button>
      )}
      {col === "IN_SESSION" && (
        <Button
          className="goLeft"
          onClick={() => updateTaskStatusLeft(task, col)}
        ></Button>
      )}
      <div className="taskTitle">{task.title}</div>
      {col === "TODO" && (
        <Button
          className="goRight"
          onClick={() => updateTaskStatusRight(task, col)}
        ></Button>
      )}
      {col === "IN_SESSION" && (
        <Button
          className="goRight"
          onClick={() => updateTaskStatusRight(task, col)}
        ></Button>
      )}
    </div>
  );
}

TaskCard.propTypes = {
  task: PropTypes.object,
  col: PropTypes.string,
};

export default TaskCard;
