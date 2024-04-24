import React, { useState } from "react";
import "../../styles/popups/InspectTask.scss";
import { api, handleError } from "helpers/api";
import PropTypes from "prop-types";
import { Button } from "components/ui/Button";
import { useNavigate, useParams } from "react-router-dom";
import Comments from "components/ui/Comments";
import { Spinner } from "components/ui/Spinner";

const FormField = (props) => {
  return (
    <div className="inspectTask field">
      <label className="inspectTask label">{props.label}</label>
      <input
        className="inspectTask input"
        placeholder={props.placeholder}
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        disabled={!props.disabled}
      />
    </div>
  );
};

const FormFieldLong = (props) => {
  return (
    <div className="inspectTask field">
      <label className="inspectTask label">{props.label}</label>
      <textarea
        className="inspectTask textarea"
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

FormFieldLong.propTypes = {
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
  const [isLoading, setIsLoading] = useState(false);

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
    setTaskTitle(task.title);
    setTaskDescription(task.description);
    setError("");
    setEditMode(false);
  };

  const doClose = () => {
    DeactivateEditMode();
    onClose();
  };

  const EditTask = async () => {
    setIsLoading(true);
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
    setIsLoading(false);
  };

  const DeleteTask = async () => {
    setIsLoading(true);
    try {
      task.status = "DELETED";
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
      setIsLoading(false);
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
    <div className="inspectTask overlay" onClick={doClose}>
      <div className="inspectTask content" onClick={(e) => e.stopPropagation()}>
        <div className="inspectTask header">
          {!editMode && (
            <Button className="red-button bts" onClick={doClose}>
              Close
            </Button>
          )}
          {editMode && (
            <Button className="red-button bts" onClick={DeactivateEditMode}>
              Cancel
            </Button>
          )}
          {!editMode && (
            <Button
              className="green-button inspectTask edit bts"
              onClick={ActivateEditMode}
            >
              Edit
            </Button>
          )}
        </div>
        <h3 className="inspectTask headline">Task Title</h3>
        <FormField
          className="inspectTask input"
          value={taskTitle}
          placeholder="enter title..."
          onChange={(ti: string) => setTaskTitle(ti)}
          disabled={editMode}
        />
        <h3 className="inspectTask headline">Task Description</h3>
        <FormFieldLong
          className="inspectTask textarea"
          value={taskDescription}
          placeholder="enter description..."
          onChange={(dc: string) => setTaskDescription(dc)}
          disabled={editMode}
        />
        {!editMode && (
          <>
            <h3 className="inspectTask headline">Comments</h3>
            <Comments taskId={task.taskId} />
          </>
        )}

        {error && <p>{error}</p>}

        <div className="inspectTask header">
          {editMode && (
            <Button
              disabled={!taskTitle}
              className="green-button bts"
              onClick={EditTask}
            >
              Save
            </Button>
          )}

          {editMode && (
            <Button className="red-button bts" onClick={DeleteTask}>
              Delete
            </Button>
          )}
        </div>
        {getAllErrorMessages().map((error, index) => (
          <div key={index} className="error-message">
            {error}
          </div>
        ))}
      </div>
      {isLoading ? <Spinner /> : ""}
    </div>
  );
};

InspectTask.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  task: PropTypes.object.isRequired,
};

export default InspectTask;
