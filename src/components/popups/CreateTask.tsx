import React, { useState } from "react";
import "../../styles/popups/InspectTask.scss";
import "../../styles/ui/FormField.scss";
import { api, handleError } from "helpers/api";
import PropTypes from "prop-types";
import { Button } from "components/ui/Button";
import { useParams } from "react-router-dom";
import { Spinner } from "components/ui/Spinner";
import { FormField } from "../ui/FormField";

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

  if (!isOpen) return null;

  //reset all fields on closing pop-up
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

    if (description && description.length > 500) {
      errors.description = "Description exceeds the 500 character limit";
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
    if (!validateForm()) return;
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
    } catch (error) {
      //new error handling with status codes
      setError("Failed to create the Task");
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
        <div className="inspectTask header">
          <h2 className="inspectTask headline">Create Task</h2>
          <Button
            className="red-button bts inspectTask headline"
            onClick={doClose}
          >
            Close
          </Button>
        </div>
        <h3 className="inspectTask headline">Title</h3>
        <FormField
          value={title}
          placeholder="enter title..."
          onChange={(e) => setTitle(e.target.value)}
        />
        <h3 className="inspectTask headline">Description</h3>
        <FormField
          value={description}
          placeholder="enter description..."
          onChange={(e) => setDescription(e.target.value)}
          isDesc={true}
        />

        {error && <p>{error}</p>}

        <Button
          className="green-button bts"
          disabled={!title}
          onClick={() => {
            CreateTask();
          }}
        >
          Create
        </Button>
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

CreateTask.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default CreateTask;
