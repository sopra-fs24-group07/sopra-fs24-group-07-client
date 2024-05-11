import React, { useState, useEffect } from 'react';
import "../../styles/popups/Notification.scss";

interface NotificationProps {
  icon: JSX.Element; // Accepts any valid JSX Element as an icon
  message: string;
  show: boolean; // Controlled by parent component to show/hide notification
  onClose: () => void; // Function to call when closing the notification
}

const Notification: React.FC<NotificationProps> = ({ icon, message, show, onClose }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose(); // Call onClose to hide the notification after 10 seconds
      }, 10000);

      return () => clearTimeout(timer); // Cleanup the timer
    }
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div className="notification">
      <div className="notification-icon">{icon}</div>
      <div className="notification-message">{message}</div>
      <button className="close-btn" onClick={onClose}>X</button>
    </div>
  );
};

export default Notification;
