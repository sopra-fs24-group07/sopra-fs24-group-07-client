import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import Notification from './Notification';

interface NotificationData {
  icon: JSX.Element;
  message: string;
}

interface NotificationContextType {
  notify: (icon: JSX.Element, message: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotification must be used within a NotificationProvider');
  return context;
};

export const NotificationProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [notification, setNotification] = useState<NotificationData | null>(null);

  const notify = useCallback((icon: JSX.Element, message: string) => {
    setNotification({ icon, message });
    console.log("XXXXX");
    setTimeout(() => setNotification(null), 10000); // Automatically clear notification after 10 seconds
  }, []);

  return (
    <NotificationContext.Provider value={{ notify }}>
      {children}
      {notification && <Notification icon={notification.icon} message={notification.message} show={!!notification} onClose={() => setNotification(null)} />}
    </NotificationContext.Provider>
  );
};
