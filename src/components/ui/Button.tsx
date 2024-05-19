import React from "react";
import PropTypes from "prop-types";
import "../../styles/ui/Button.scss";

export const Button = (props) => (
  <button
    {...props}
    style={{ width: props.width, ...props.style }}
    className={`primary-button ${props.className}`}
  >
    {props.inSession !== undefined && (
      <div
        className={`status-indicator ${
          props.inSession === "inSession" ? "red" : ""
        }`}
      />
    )}
    {props.children}
  </button>
);

Button.propTypes = {
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  style: PropTypes.object,
  className: PropTypes.string,
  children: PropTypes.node,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  inSession: PropTypes.string,
};
