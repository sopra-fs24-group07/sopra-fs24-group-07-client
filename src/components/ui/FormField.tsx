import React from "react";
import "styles/ui/FormField.scss";
import PropTypes from "prop-types";

const FormField = ({ label, value, onChange, type = "text"}) => (
  <div className="form-field">
    <label className="form-field label" htmlFor={label}>
      {label}
    </label>
    <input
      className="form input"
      placeholder="enter here.."
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      id={label}
    />
  </div>
);

// SEE NEW TYPE "type"
FormField.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  type: PropTypes.string,
};

export default FormField;