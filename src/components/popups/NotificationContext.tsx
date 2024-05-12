import React, { createContext, useContext, useState, useCallback } from "react";
import PropTypes from "prop-types";
import Notification from "./Notification";


interface NotificationData {
  id: number;
  iconName: string;
  message: string;
  link?: string;
}

interface NotificationContextType {
  notify: (iconName: string, message: string, link?: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  }

  return context;
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);

  const notify = useCallback(
    (iconName: string, message: string, link?: string) => {
      const newNotification = {
        id: new Date().getTime(),
        iconName,
        message,
        link,
      };
      setNotifications((prev) => [...prev, newNotification]);
      setTimeout(() => {
        setNotifications((prev) =>
          prev.filter((n) => n.id !== newNotification.id)
        );
      }, 7000); // 15 seconds
    },
    []
  );

  return (
    <NotificationContext.Provider value={{ notify }}>
      {children}
      <div className="notification-container">
        {notifications.map((notification) => (
          <Notification
            className="notification popup"
            key={notification.id}
            iconName={notification.iconName}
            message={notification.message}
            show={true}
            onClose={() =>
              setNotifications((prev) =>
                prev.filter((n) => n.id !== notification.id)
              )
            }
            link={notification.link}
          />
        ))}
      </div>
    </NotificationContext.Provider>
  );
};

NotificationProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
