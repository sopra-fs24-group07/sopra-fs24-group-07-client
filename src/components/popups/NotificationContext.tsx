import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import Notification from './Notification';
import PropTypes from 'prop-types';

interface NotificationData {
  iconName: string;
  message: string;
  link?: string;
}

interface NotificationContextType {
  notify: (iconName: string, message: string, link?: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotification must be used within a NotificationProvider');
  return context;
};

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notification, setNotification] = useState<NotificationData | null>(null);

  const notify = useCallback((iconName: string, message: string, link?: string) => {
    setNotification({ iconName, message, link });
    setTimeout(() => setNotification(null), 10000);
  }, []);

  return (
    <NotificationContext.Provider value={{ notify }}>
      {children}
      {notification && <Notification iconName={notification.iconName} message={notification.message} show={!!notification} onClose={() => setNotification(null)} link={notification.link} />}
    </NotificationContext.Provider>
  );
};

NotificationProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
