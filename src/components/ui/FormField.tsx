import React from "react";
import "styles/ui/FormField.scss";
import PropTypes from "prop-types";

const FormField = ({
  label,
  value,
  onChange,
  type = "text",
  textArea = false,
  disabled,
  children,
}) => (
  <div className="form-field">
    <div className="form-field-header">
      <label className="form-field label" htmlFor={label}>
        {label}
      </label>
      {children}
    </div>
    {textArea ? (
      <textarea
        className="form-field textarea"
        placeholder="Enter here..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        id={label.replace(/\s+/g, "-").toLowerCase()}
        disabled={disabled}
      />
    ) : (
      <input
        className="form-field input"
        placeholder="Enter here..."
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        id={label.replace(/\s+/g, "-").toLowerCase()}
        disabled={disabled}
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
  disabled: PropTypes.bool,
  children: PropTypes.node,
};

export default FormField;
