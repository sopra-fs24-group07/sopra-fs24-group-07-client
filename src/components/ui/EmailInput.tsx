import React from "react";
import PropTypes from "prop-types";

const EmailInput = ({ email, setEmail, error, setError }) => {
  // OWASP recommended regex pattern for email validation
  const emailRegex = new RegExp(
    "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"
  );

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    if (!emailRegex.test(value)) {
      setError("Please enter a valid email address.");
    } else {
      setError("");
    }
  };

  return (
    <div className="TeamSetting field">
      <input
        type="text"
        className="TeamSetting input"
        placeholder="Enter email..."
        value={email}
        onChange={handleEmailChange}
      />
    </div>
  );
};

EmailInput.propTypes = {
  email: PropTypes.string,
  setEmail: PropTypes.func,
  error: PropTypes.string,
  setError: PropTypes.func,
};

export default EmailInput;
