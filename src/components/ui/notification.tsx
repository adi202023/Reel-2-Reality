import React, { useEffect, useState } from 'react';

export interface NotificationProps {
  type: 'success' | 'error' | 'info';
  message: string;
  duration?: number;
  onClose?: () => void;
}

const Notification: React.FC<NotificationProps> = ({
  type,
  message,
  duration = 5000,
  onClose
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => {
        onClose?.();
      }, 300); // Wait for fade out animation
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'info':
        return 'ℹ️';
      default:
        return '📢';
    }
  };

  const getClassName = () => {
    const baseClass = 'fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg transition-all duration-300 transform';
    const visibilityClass = isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0';
    
    switch (type) {
      case 'success':
        return `${baseClass} ${visibilityClass} bg-gradient-to-r from-green-500 to-emerald-600 text-white`;
      case 'error':
        return `${baseClass} ${visibilityClass} bg-gradient-to-r from-red-500 to-red-600 text-white`;
      case 'info':
        return `${baseClass} ${visibilityClass} bg-gradient-to-r from-blue-500 to-blue-600 text-white`;
      default:
        return `${baseClass} ${visibilityClass} bg-gradient-to-r from-gray-500 to-gray-600 text-white`;
    }
  };

  return (
    <div className={getClassName()}>
      <span className="text-lg">{getIcon()}</span>
      <span className="font-medium">{message}</span>
      <button
        onClick={() => {
          setIsVisible(false);
          setTimeout(() => onClose?.(), 300);
        }}
        className="ml-2 text-white/80 hover:text-white transition-colors"
      >
        ✕
      </button>
    </div>
  );
};

export default Notification;
