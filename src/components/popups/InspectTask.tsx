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
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const ActivateEditMode = () => {
    setEditMode(true);
  };
  const DeactivateEditMode = () => {
    setEditMode(false);
  };

  const doClose = () => {
    setTaskTitle(task.title);
    setTaskDescription(task.description);
    setError("");
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
      //maybe remove when external api is ready
      location.reload();
    } catch (error) {
      //new error handling
      setError("Failed to edit the Task");
      if (error.response.status === 401) {
        setError("You are not authorized to edit this Task");
      } else if (error.response.status === 404) {
        setError("The task you tried to edit does not exist");
      }
      console.error("Error editing Task:", handleError(error));
    }
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
      //maybe remove when external api is ready
      location.reload();
    } catch (error) {
      setError("Failed to delete the Task");
      if (error.response.status === 401) {
        setError("You are not authorized to delete this Task");
      } else if (error.response.status === 404) {
        setError("The task you tried to delete does not exist");
      }
      console.error("Error deleting Task:", handleError(error));
    }
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

        {error && <p>{error}</p>}

        <div>
          {!editMode && (
            <Button className="green-button" onClick={ActivateEditMode}>
              Edit
            </Button>
          )}
          {/*ToDO: enable when API is ready */}
          {editMode && (
            <Button className="red-button" onClick={DeleteTask} disabled>
              Delete
            </Button>
          )}
          {/*ToDO: disabled={!taskTitle || !taskDescription} when API is ready */}
          {editMode && (
            <Button disabled className="green-button" onClick={EditTask}>
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
