import React, { useState, useEffect } from "react";
import "../../styles/popups/InspectTask.scss";
import { api, handleError } from "helpers/api";
import PropTypes from "prop-types";
import { useParams } from "react-router-dom";
import Comments from "components/ui/Comments";
import { Spinner } from "components/ui/Spinner";
import Pusher from "pusher-js";
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
import { useNotification } from "./NotificationContext";
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
  const { notify } = useNotification();
  const [currentTask, setCurrentTask] = useState(task);

  useEffect(() => {
    setCurrentTask(task);
  }, [task]);

  useEffect(() => {
    if (!isOpen) return;

    const pusher = new Pusher(process.env.REACT_APP_PUSHER_KEY, {
      cluster: "eu",
      forceTLS: true,
    });

    const channel = pusher.subscribe(`task-${task.taskId}`);
    channel.bind("task-update", (updatedTask) => {
      setCurrentTask(updatedTask);
      if (updatedTask.status === "DELETED") {
        onClose();
      }
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [isOpen, task.taskId, onClose]);

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

    if (taskDescription && taskDescription.length > 1000) {
      errors.description = "Description exceeds the 1000 character limit";
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

  const doClose = (e) => {
    e.stopPropagation();
    onClose();
  };

  const EditTask = async () => {
    setIsLoading(true);
    if (!validateForm()) {
      notify("error", "Some inputs are invalid!");
      setIsLoading(false);
      return;
    }
    try {
      task.title = taskTitle;
      task.description = taskDescription;
      const requestBody = JSON.stringify(task);
      await api.put(
        `/api/v1/teams/${teamId}/tasks/${task.taskId}`,
        requestBody,
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      DeactivateEditMode();
      notify("success", "Task edited successfully!");
    } catch (error) {
      setError("Failed to edit the Task");
      notify("error", "Failed to edit the Task. Please try again.");
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
      await api.put(
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

  if (!isOpen) return null;

  return (
    <div className="inspectTask overlay" onClick={doClose}>
      <div className="inspectTask content" onClick={(e) => e.stopPropagation()}>
        <PopupHeader
          onClose={onClose}
          title={editMode ? "Edit Task" : "Task Details"}
        />
        <FormField
          label={"Task Title"}
          value={editMode ? taskTitle : currentTask.title}
          placeholder="enter title..."
          onChange={(ti: string) => setTaskTitle(ti)}
          disabled={!editMode}
        >
          {!editMode && (
            <IconButton
              hoverIcon={MdModeEditOutline}
              icon={MdOutlineModeEdit}
              onClick={ActivateEditMode}
              className="blue-icon"
              style={{
                scale: "2",
                marginRight: "10px",
                marginBottom: "5px",
              }}
            />
          )}
          {editMode && !inSession && (
            <IconButton
              hoverIcon={MdEditOff}
              icon={MdOutlineEditOff}
              onClick={DeactivateEditMode}
              className="red-icon"
              style={{ scale: "2", marginRight: "10px", marginBottom: "5px" }}
            />
          )}
        </FormField>
        <FormField
          label={"Task Description"}
          value={editMode ? taskDescription : currentTask.description}
          placeholder="enter description..."
          onChange={(dc: string) => setTaskDescription(dc)}
          disabled={!editMode}
          textArea={true}
          taS={true}
        />
        {getAllErrorMessages().map((error, index) => (
          <div key={index} className="inspectTask error">
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
              hoverIcon={MdDelete}
              icon={MdDeleteOutline}
              onClick={DeleteTask}
              className="red-icon"
              style={{ scale: "2.5", marginTop: "10px", marginRight: "10px" }}
            />
          </div>
        )}
        {!editMode && <Comments taskId={task.taskId} />}
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
