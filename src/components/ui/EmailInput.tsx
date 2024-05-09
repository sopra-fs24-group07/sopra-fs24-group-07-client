import React from "react";
import PropTypes from "prop-types";

const EmailInput = ({ email, setEmail, emailError }) => {
  return (
    <div className="TeamSetting field">
      <input
        className="TeamSetting input"
        placeholder="Enter email..."
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      {emailError && <p className="TeamSetting error">{emailError}</p>}
    </div>
  );
};

EmailInput.propTypes = {
  email: PropTypes.string,
  setEmail: PropTypes.func,
  emailError: PropTypes.string,
};

export default EmailInput;