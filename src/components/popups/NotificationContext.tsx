import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import Notification from './Notification';

interface NotificationData {
  icon: JSX.Element;
  message: string;
  link?: string;
}

interface NotificationContextType {
  notify: (icon: JSX.Element, message: string, link?: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotification must be used within a NotificationProvider');
  return context;
};

export const NotificationProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [notification, setNotification] = useState<NotificationData | null>(null);

  const notify = useCallback((icon: JSX.Element, message: string, link?: string) => {
    setNotification({ icon, message, link });
    setTimeout(() => setNotification(null), 10000);
  }, []);

  return (
    <NotificationContext.Provider value={{ notify }}>
      {children}
      {notification && <Notification icon={notification.icon} message={notification.message} show={!!notification} onClose={() => setNotification(null)} link={notification.link} />}
    </NotificationContext.Provider>
  );
};
