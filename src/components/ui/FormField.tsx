import React from "react";
import "styles/ui/FormField.scss";
import PropTypes from "prop-types";

const FormField = ({
  label,
  value,
  onChange,
  type = "text",
  textArea = false,
}) => (
  <div className="form-field">
    <label className="form-field label" htmlFor={label}>
      {label}
    </label>
    {textArea ? (
      <textarea
        className="form-field textarea"
        placeholder="Enter here..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        id={label.replace(/\s+/g, "-").toLowerCase()}
      />
    ) : (
      <input
        className="form-field input"
        placeholder="Enter here..."
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        id={label.replace(/\s+/g, "-").toLowerCase()}
      />
    )}
  </div>
);

FormField.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  type: PropTypes.string,
  textArea: PropTypes.bool,
};

export default FormField;
