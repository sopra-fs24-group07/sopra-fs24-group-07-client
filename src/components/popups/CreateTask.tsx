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
        placeholder="enter here.."
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
      />
    </div>
  );
};

FormField.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  type: PropTypes.string,
};

const CreateTask = ({ isOpen, onClose }) => {
  const { teamId } = useParams();
  const token = sessionStorage.getItem("token");
  //title of a task
  const [title, setTitle] = useState<string>(null);
  //description of a task
  const [description, setDescription] = useState<string>(null);

  if (!isOpen) return null;

  //try to create a task via api pst call
  const CreateTask = async () => {
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
    } catch (error) {
      console.log("Error creating new Task:", handleError(error));
    }
    //reset input fields after submitting
    setDescription(null);
    setTitle(null);
    //maybe remove when external api is ready
    location.reload();
  };

  return (
    <div className="createTeam overlay" onClick={onClose}>
      <div className="createTeam content" onClick={(e) => e.stopPropagation()}>
        <Button className="red-button" onClick={onClose}>
          Close
        </Button>
        <h2>Create Task</h2>
        <FormField
          label="title"
          value={title}
          onChange={(ti: string) => setTitle(ti)}
        />

        <FormField
          label="description"
          value={description}
          onChange={(dc: string) => setDescription(dc)}
        />

        <Button
          className="green-button"
          disabled={!description || !title}
          onClick={() => {
            CreateTask();
            onClose();
          }}
        >
          Create
        </Button>
      </div>
    </div>
  );
};

CreateTask.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default CreateTask;
