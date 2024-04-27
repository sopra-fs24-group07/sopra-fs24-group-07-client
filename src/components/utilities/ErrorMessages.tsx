import React from "react";
import PropTypes from "prop-types";

const ErrorMessages = ({ errors, generalError }) => {
  const getErrorMessages = () => {
    const fieldErrors = Object.values(errors).filter((error) => error);
    if (generalError) {
      fieldErrors.push(generalError);
    }
    return fieldErrors;
  };

  const errorMessages = getErrorMessages();

  return (
    <div>
      {errorMessages.length > 0 &&
        errorMessages.map((error, index) => (
          <div key={index} className="error-message">
            {error}
          </div>
        ))}
    </div>
  );
};

ErrorMessages.propTypes = {
  errors: PropTypes.object.isRequired,
  generalError: PropTypes.string,
};

ErrorMessages.defaultProps = {
  generalError: "",
};

export default ErrorMessages;
