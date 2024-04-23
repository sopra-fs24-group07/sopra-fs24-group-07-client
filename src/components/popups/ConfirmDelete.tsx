import React, { useState } from "react";
import { api } from "helpers/api";
import { Button } from "components/ui/Button";
import PropTypes from "prop-types";

const FormField = ({ label, value, onChange, type = "text" }) => (
  <div className="register field">
    <label className="register label" htmlFor={label}>
      {label}
    </label>
    <input
      className="register input"
      placeholder="enter here.."
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);

FormField.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  type: PropTypes.string,
};

const ConfirmDelete = ({ onCancel, onConfirm }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLoginAndDelete = async () => {
    try {
      const requestBody = JSON.stringify({ username, password });
      const response = await api.post("/api/v1/login", requestBody);
      if (response) {
        onConfirm();
      } else {
        setError("Invalid credentials.");
      }
    } catch (err) {
      setError("Deletion failed. Please try again.");
      console.error("Error during account deletion:", err);
    }
  };

  return (
    <div className="confirmation-popup">
      <div className="popup-content">
        <h3>Confirm Deletion</h3>
        <p>After deleting your account you will not be able to log in anymore.<br/ >
          You will be removed from all your teams and all your comments on tasks are deleted.<br />
          Please confirm the delete request with your username and password.</p>
        <FormField
          label="Username"
          type="text"
          placeholder="Username"
          value={username}
          onChange={(newValue) => setUsername(newValue)}
        />
        <FormField
          label="Password"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(newValue) => setPassword(newValue)}
        />
        <Button onClick={handleLoginAndDelete}>Confirm</Button>
        <Button onClick={onCancel}>Cancel</Button>
        {error && <div className="error-message">{error}</div>}
      </div>
    </div>
  );
};

ConfirmDelete.propTypes = {
  onCancel: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
};

export default ConfirmDelete;
