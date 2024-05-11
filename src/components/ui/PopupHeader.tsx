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
      className="red-icon"
      style={{ scale: "1.8", marginLeft: "20px", marginRight: "5px" }}
    />
  </div>
);

PopupHeader.propTypes = {
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};
