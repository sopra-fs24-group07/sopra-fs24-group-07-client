import React from "react";
import PropTypes from "prop-types";
import "../../styles/ui/Logo.scss";
import { propertyIsEnumerable } from "react-scripts";
import { useNavigate } from "react-router-dom";

export const Logo = (props) => (
  <img
    src="https://i.ibb.co/PNcL35t/logo.png"
    alt=""
    style={{ margin: props.margin }}
    width={props.width}
  />
);

Logo.propTypes = {
  width: PropTypes.number,
  margin: PropTypes.string
};