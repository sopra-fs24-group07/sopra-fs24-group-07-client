import React, { useState } from "react";
import "../../styles/popups/InspectTask.scss";
import { api, handleError } from "helpers/api";
import PropTypes from "prop-types";
import { Button } from "components/ui/Button";
import { useParams } from "react-router-dom";
import { Spinner } from "components/ui/Spinner";

import { useNotification } from "../popups/NotificationContext";

import FormField from "../ui/FormField";
import { PopupHeader } from "../ui/PopupHeader";

const CreateTask = ({ isOpen, onClose }) => {
  const { teamId } = useParams();
  const token = localStorage.getItem("token");
  //title of a task
  const [title, setTitle] = useState<string>(null);
  //description of a task
  const [description, setDescription] = useState<string>(null);
  //set error
  const [error, setError] = useState("");
  //set field errors
  const [errors, setErrors] = useState({
    title: "",
    description: "",
  });
  const [generalError, setGeneralError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { notify } = useNotification();

  if (!isOpen) return null;

  //reset all fiels on closing pop-up
  const doClose = () => {
    setError("");
    setTitle(null);
    setDescription(null);
    onClose();
  };

  const validateForm = () => {
    let isValid = true;
    let errors = { title: "", description: "" };

    if (!title) {
      errors.title = "Title is required";
      isValid = false;
    }

    if (title && title.length > 100) {
      errors.title = "Title exceeds the 100 character limit";
      isValid = false;
    }

    if (description && description.length > 1000) {
      errors.description = "Description exceeds the 1000 character limit";
      isValid = false;
    }

    setErrors(errors);
    setTimeout(() => {}, 500);
    setIsLoading(false);

    return isValid;
  };

  //try to create a task via api pst call
  const CreateTask = async () => {
    setIsLoading(true);
    if (!validateForm()) {
      notify("error", "Some inputs are invalid!");

      return;
    }

    try {
      const requestBody = JSON.stringify({ title, description });
      const response = await api.post(
        `/api/v1/teams/${teamId}/tasks`,
        requestBody,
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      //reset input fields after submitting
      doClose();
      notify("success", "Task created successfully!");
    } catch (error) {
      //new error handling with status codes
      setError("Failed to create the Task");
      notify("error", "Failed to create the Task. Please try again.");
      if (error.response.status === 401) {
        setError("You are not authorized to create a Task");
      } else if (error.response.status === 400) {
        setError("Please enter a Title and Description");
      }
      console.error("Error creating new Task:", handleError(error));
    }
    setIsLoading(false);
  };

  const getAllErrorMessages = () => {
    const fieldErrors = Object.values(errors).filter((error) => error);
    if (generalError) fieldErrors.push(generalError);

    return fieldErrors;
  };

  return (
    <div className="inspectTask overlay" onClick={doClose}>
      <div className="inspectTask content" onClick={(e) => e.stopPropagation()}>
        <PopupHeader onClose={onClose} title="Create Task" />
        <FormField
          className="inspectTask input"
          label={"Title"}
          value={title}
          placeholder="enter title..."
          onChange={(ti: string) => setTitle(ti)}
        />
        <FormField
          className="inspectTask textarea"
          label={"Description"}
          value={description}
          textArea={true}
          placeholder="enter description..."
          onChange={(dc: string) => setDescription(dc)}
        />

        {error && <p>{error}</p>}
        <div>
        {getAllErrorMessages().map((error, index) => (
          <div key={index} className="inspectTask error">
            {error}
          </div>
        ))}
        </div>

        <Button
          className="green-button bts createTeam cButton"
          disabled={!title}
          width="100%"
          onClick={() => {
            CreateTask();
          }}
        >
          Create
        </Button>
      </div>
      {isLoading ? <Spinner /> : ""}
    </div>
  );
};

CreateTask.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default CreateTask;
