import React, { useState, useEffect } from 'react';
import "../../styles/popups/Notification.scss";
import IconButton from "../ui/IconButton";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/Button";

interface NotificationProps {
  icon: JSX.Element;
  message: string;
  show: boolean;
  onClose: () => void;
  link?: string;
}

const Notification: React.FC<NotificationProps> = ({ icon, message, link="", show, onClose }) => {
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
      <div className="notification-icon">{icon}</div>
      <div className="notification-message">{message}</div>
      <Button className="red-button" onClick={onClose}>X</Button>
      {link && (
        <Button className="link-btn" onClick={() => handleLinkClick()}>Go</Button>
      )}
    </div>
  );
};

export default Notification;
