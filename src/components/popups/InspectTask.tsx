import React, { useState } from "react";
import "../../styles/popups/CreateTeam.scss";
import { api, handleError } from "helpers/api";
import PropTypes from "prop-types";
import { Button } from "components/ui/Button";
import { useNavigate, useParams } from "react-router-dom";

const InspectTask = ({ isOpen, onClose, task }) => {
  const [editMode, setEditMode] = useState(false);
  const [taskTitle, setTaskTitle] = useState(task.title);
  const [taskDescription, setTaskDescription] = useState(task.description);
  const { teamId } = useParams();
  const token = sessionStorage.getItem("token");
  if (!isOpen) return null;

  const ActivateEditMode = () => {
    setEditMode(true);
  };
  const DeactivateEditMode = () => {
    setEditMode(false);
  };

  const doClose = () => {
    DeactivateEditMode();
    onClose();
  };

  const EditTask = async () => {
    try {
      task.title = taskTitle;
      task.description = taskDescription;
      const requestBody = JSON.stringify(task);
      const response = await api.put(
        `/api/v1/teams/${teamId}/tasks/${task.taskId}`,
        requestBody,
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
    } catch (error) {
      console.error("Error editing Task:", handleError(error));
    }

    //maybe remove when external api is ready
    location.reload();
  };

  const DeleteTask = async () => {
    try {
      const response = await api.delete(
        `/api/v1/teams/${teamId}/tasks/${task.taskId}`,
        {
          headers: {
            Authorization: `${token}`,
          },
          params: {},
        }
      );
    } catch (error) {
      console.error("Error deleting Task:", handleError(error));
    }

    //maybe remove when external api is ready
    location.reload();
  };

  return (
    <div className="createTeam overlay" onClick={doClose}>
      <div className="createTeam content" onClick={(e) => e.stopPropagation()}>
        <Button className="red-button" onClick={doClose}>
          Close
        </Button>
        <h2>Create Task</h2>
        <h3>Task Title</h3>
        <input
          value={taskTitle}
          onChange={(tati) => setTaskTitle(tati.target.value)}
          placeholder="Task Title..."
          disabled={!editMode}
        />
        <h3>Task Description</h3>
        <input
          value={taskDescription}
          onChange={(tade) => setTaskDescription(tade.target.value)}
          placeholder="Task Description..."
          disabled={!editMode}
        />
        <div>
          {!editMode && (
            <Button className="green-button" onClick={ActivateEditMode}>
              Edit
            </Button>
          )}
          {editMode && (
            <Button className="red-button" onClick={DeleteTask}>
              Delete
            </Button>
          )}
          {editMode && (
            <Button
              disabled={!taskTitle || !taskDescription}
              className="green-button"
              onClick={EditTask}
            >
              Save
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

InspectTask.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  task: PropTypes.object.isRequired,
};

export default InspectTask;
