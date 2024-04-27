import React from "react";
import PropTypes from "prop-types";
import "../../styles/ui/FormField.scss";

export const FormField = ({ label, placeholder = "Enter here...", type = "text", value, onChange, error, disabled=false }) => (
  <div className="formField field">
    <label className="formField label">{label}</label>
    <input
      className={`formField input ${error ? "input-error" : ""}`}
      placeholder={placeholder}
      type={type}
      value={value}
      onChange={onChange}
      disabled={disabled}
    />
  </div>
);

FormField.propTypes = {
  label: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  type: PropTypes.string,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  error: PropTypes.string,
  disabled: PropTypes.boolean,
};

