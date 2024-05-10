import React, { useState } from "react";
import "../../styles/popups/InspectTask.scss";
import { api, handleError } from "helpers/api";
import PropTypes from "prop-types";
import { Button } from "components/ui/Button";
import { useNavigate, useParams } from "react-router-dom";
import Comments from "components/ui/Comments";
import { Spinner } from "components/ui/Spinner";

import { IoMdCloseCircle, IoMdCloseCircleOutline } from "react-icons/io";
import {
  MdModeEditOutline,
  MdOutlineModeEdit,
  MdSave,
  MdOutlineSave,
  MdDeleteOutline,
  MdDelete,
  MdOutlineEditOff,
  MdEditOff,
} from "react-icons/md";
import IconButton from "../ui/IconButton";
import FormField from "../ui/FormField";
import { PopupHeader } from "../ui/PopupHeader";

const InspectTask = ({ isOpen, onClose, task, inSession }) => {
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
    setIsLoading(false);

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
        <PopupHeader onClose={onClose} title="Edit Task"></PopupHeader>
        <FormField
          className="inspectTask input"
          label={"Task Title"}
          value={taskTitle}
          placeholder="enter title..."
          onChange={(ti: string) => setTaskTitle(ti)}
          disabled={editMode}
        />
        <FormField
          className="inspectTask textarea"
          label={"Task Description"}
          value={taskDescription}
          placeholder="enter description..."
          onChange={(dc: string) => setTaskDescription(dc)}
          disabled={editMode}
        />
        {getAllErrorMessages().map((error, index) => (
          <div key={index} className="error-message">
            {error}
          </div>
        ))}

        {error && <p>{error}</p>}

        {editMode && (
        <div className="inspectTask header">
            <IconButton
              hoverIcon={MdSave}
              icon={MdOutlineSave}
              onClick={EditTask}
              className="green-icon"
              style={{ scale: "2.5", marginLeft: "10px", marginTop: "10px" }}
            />
            <IconButton
              hoverIcon={MdEditOff}
              icon={MdOutlineEditOff}
              onClick={DeactivateEditMode}
              className="red-icon"
              style={{ scale: "2.5", marginRight: "10px", marginTop: "5px" }}
            />
            <IconButton
              hoverIcon={MdDelete}
              icon={MdDeleteOutline}
              onClick={DeleteTask}
              className="red-icon"
              style={{ scale: "2.5", marginTop: "10px", marginRight: "10px" }}
            />

        </div>
      )}
        {!editMode && !inSession && (
          <IconButton
            hoverIcon={MdModeEditOutline}
            icon={MdOutlineModeEdit}
            onClick={ActivateEditMode}
            className="green-icon"
            style={{ scale: "2.5", marginRight: "10px", marginTop: "5px" }}
          />
        )}
        {!editMode && (
            <Comments taskId={task.taskId} />
        )}
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
