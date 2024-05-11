import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/Button";
import IconButton from "../ui/IconButton";
import { IoMdCloseCircle, IoMdCloseCircleOutline, IoMdCheckmarkCircleOutline, IoMdLock, IoMdAlert } from "react-icons/io";
import "../../styles/popups/Notification.scss";

const icons = {
  success: <IoMdCheckmarkCircleOutline className="success" />,
  lock: <IoMdLock className="lock" />,
  error: <IoMdAlert className="error" />
};

interface NotificationProps {
  iconName: string;
  message: string;
  show: boolean;
  onClose: () => void;
  link?: string;
}

const Notification: React.FC<NotificationProps> = ({ iconName, message, link="", show, onClose }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, 20000);

      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  const handleLinkClick = () => {
    navigate(link);
    onClose();
  }

  return (
    <div className="notification">
      <div className="notification-icon">{icons[iconName]}</div>
      <div className="notification-message">{message}</div>
      <IconButton
        hoverIcon={IoMdCloseCircle}
        icon={IoMdCloseCircleOutline}
        onClick={onClose}
        className="grey-icon"
        style={{ scale: "1.8", marginLeft: "20px", marginRight: "5px" }}
      />
      {link && (
        <Button className="link-btn" onClick={() => handleLinkClick()}>Go</Button>
      )}
    </div>
  );
};

export default Notification;
