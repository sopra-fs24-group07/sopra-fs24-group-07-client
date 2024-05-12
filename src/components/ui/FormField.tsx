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
  taS = false,
  com = false,
}) => (
  <div className="form-field">
    <div className="form-field-header">
      <label
        className="form-field-label"
        htmlFor={label.replace(/\s+/g, "-").toLowerCase()}
      >
        {label}
      </label>
      {children}
    </div>
    {textArea ? (
      taS ? (
        <textarea
          className="form-field textarea small"
          placeholder="Enter here..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          id={label.replace(/\s+/g, "-").toLowerCase()}
          disabled={disabled}
        />
      ) : (
        <textarea
          className="form-field textarea"
          placeholder="Enter here..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          id={label.replace(/\s+/g, "-").toLowerCase()}
          disabled={disabled}
        />
      )
    ) : com ? (
      <input
        className="form-field input com"
        placeholder="Enter here..."
        type={type}
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
  taS: PropTypes.bool,
  com: PropTypes.bool,
  disabled: PropTypes.bool,
  children: PropTypes.node,
};

export default FormField;
