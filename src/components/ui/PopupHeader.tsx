import React from "react";
import PropTypes from "prop-types";
import IconButton from "./IconButton";
import { IoMdCloseCircle, IoMdCloseCircleOutline } from "react-icons/io";

export const PopupHeader = ({ onClose, title }) => (
  <div className="profileMenu-header">
    <h2>{title}</h2>
    <IconButton
      hoverIcon={IoMdCloseCircle}
      icon={IoMdCloseCircleOutline}
      onClick={onClose}
      className="blue-icon"
      style={{ scale: "2.3", marginRight: "10px" }}
    />
  </div>
);

PopupHeader.propTypes = {
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};
