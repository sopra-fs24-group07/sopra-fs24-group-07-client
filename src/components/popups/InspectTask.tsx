import React, { useState } from "react";
import "../../styles/popups/CreateTeam.scss";
import { api, handleError } from "helpers/api";
import PropTypes from "prop-types";
import { Button } from "components/ui/Button";
import { useNavigate, useParams } from "react-router-dom";

const CreateTask = ({ isOpen, onClose, task }) => {
  if (!isOpen) return null;

  return (
    <div className="createTeam overlay" onClick={onClose}>
      <div className="createTeam content" onClick={(e) => e.stopPropagation()}>
        <Button className="red-button" onClick={onClose}>
          Close
        </Button>
        <h2>Create Task</h2>
        <h3>Task Title</h3>
        {task.title}
        <h3>Task Description</h3>
        <p>{task.description}</p>
        <Button className="green-button">Edit</Button>
      </div>
    </div>
  );
};

CreateTask.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  task: PropTypes.object.isRequired,
};

export default CreateTask;
