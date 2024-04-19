import React, { useState } from "react";
import "../../styles/popups/CreateTeam.scss";
import { api, handleError } from "helpers/api";
import PropTypes from "prop-types";
import { Button } from "components/ui/Button";
import { useNavigate, useParams } from "react-router-dom";

const FormField = (props) => {
  return (
    <div className="createTeam field">
      <label className="createTeam label">{props.label}</label>
      <input
        className="createTeam input"
        placeholder={props.placeholder}
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        disabled={!props.disabled}
      />
    </div>
  );
};

FormField.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  type: PropTypes.string,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
};

const InspectTask = ({ isOpen, onClose, task }) => {
  const [editMode, setEditMode] = useState(false);
  const [taskTitle, setTaskTitle] = useState(task.title);
  const [taskDescription, setTaskDescription] = useState(task.description);
  const { teamId } = useParams();
  const token = localStorage.getItem("token");
  const [error, setError] = useState("");
  const [errors, setErrors] = useState({
    title: "",
    description: "",
  });
  const [generalError, setGeneralError] = useState("");

  if (!isOpen) return null;

  const validateForm = () => {
    let isValid = true;
    let errors = { title: "", description: "" };

    if (!taskTitle) {
      errors.title = "Title is required";
      isValid = false;
    }

    if (taskTitle && taskTitle.length > 100) {
      errors.title = "Title exceeds the 100 character limit";
      isValid = false;
    }

    if (taskDescription && taskDescription.length > 500) {
      errors.description = "Description exceeds the 500 character limit";
      isValid = false;
    }

    setErrors(errors);
    setTimeout(() => {}, 500);

    return isValid;
  };

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
    if (!validateForm()) return;
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

  const getAllErrorMessages = () => {
    const fieldErrors = Object.values(errors).filter((error) => error);
    if (generalError) fieldErrors.push(generalError);

    return fieldErrors;
  };

  return (
    <div className="createTeam overlay" onClick={doClose}>
      <div className="createTeam content" onClick={(e) => e.stopPropagation()}>
        <Button className="red-button" onClick={doClose}>
          Close
        </Button>
        <h2>Create Task</h2>
        <h3 className="createTeam headline">Title</h3>
        <FormField
          className="createTeam input"
          value={taskTitle}
          placeholder="enter title..."
          onChange={(ti: string) => setTaskTitle(ti)}
          disabled={editMode}
        />
        <h3 className="createTeam headline">Description</h3>
        <FormField
          className="createTeam input"
          value={taskDescription}
          placeholder="enter description..."
          onChange={(dc: string) => setTaskDescription(dc)}
          disabled={editMode}
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
          {editMode && (
            <Button
              disabled={!taskTitle}
              className="green-button"
              onClick={EditTask}
            >
              Save
            </Button>
          )}
        </div>
        {getAllErrorMessages().map((error, index) => (
          <div key={index} className="error-message">
            {error}
          </div>
        ))}
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
