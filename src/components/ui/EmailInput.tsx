import React from "react";
import PropTypes from "prop-types";

const EmailInput = ({ email, setEmail, emailError, setEmailError }) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    if (!emailRegex.test(value)) {
      setEmailError("Please enter a valid email address.");
    } else {
      setEmailError("");
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
      {emailError && <p className="TeamSetting error">{emailError}</p>}
    </div>
  );
};

EmailInput.propTypes = {
  email: PropTypes.string,
  setEmail: PropTypes.func,
  emailError: PropTypes.string,
  setEmailError: PropTypes.func,
};

export default EmailInput;
