import React, { useState } from "react";
import "../../styles/popups/InspectTask.scss";
import { api, handleError } from "helpers/api";
import PropTypes from "prop-types";
import { Button } from "components/ui/Button";
import { useNavigate, useParams } from "react-router-dom";
import Comments from "components/ui/Comments";
import { Spinner } from "components/ui/Spinner";
import { FormField } from "../ui/FormField";
import { validateTaskForm } from "../utilities/ValidateForm";

const InspectTask = ({ isOpen, onClose, task, inSession }) => {
  const [editMode, setEditMode] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
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

  const ActivateEditMode = () => {
    setEditMode(true);
  };
  const DeactivateEditMode = () => {
    setTitle(task.title);
    setDescription(task.description);
    setError("");
    setErrors("");
    setGeneralError("");
    setEditMode(false);
  };

  const doClose = () => {
    DeactivateEditMode();
    onClose();
  };

  const EditTask = async () => {
    setIsLoading(true);
    setIsLoading(true);
    const isValid = validateTaskForm({
      title,
      description,
      setErrors,
      setIsLoading,
    });
    if (!isValid) return;

    try {
      task.title = title;
      task.description = description;
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
      DeactivateEditMode();
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
          {!editMode && !inSession && (
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
          className="formField input"
          value={title}
          placeholder="enter title..."
          onChange={(e) => setTitle(e.target.value)}
          disabled={!editMode}
        />
        <h3 className="inspectTask headline">Task Description</h3>
        <FormField
          className="formField textarea"
          value={description}
          placeholder="enter description..."
          onChange={(e) => setDescription(e.target.value)}
          disabled={!editMode}
          isDesc={true}
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
              disabled={!title}
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
  inSession: PropTypes.bool,
};

export default InspectTask;
