import React, { useEffect, useState } from 'react';

interface ProgressFieldProps {
  sessionStatus: string;
  time: string;
}

const ProgressField: React.FC<ProgressFieldProps> = ({ sessionStatus, time }) => {
  const [secondsLeft, setSecondsLeft] = useState<number>(0);
  const [totalSeconds, setTotalSeconds] = useState<number>(0);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Calculate total seconds when session starts
    if (sessionStatus === 'on') {
      const parts = time.split(':');
      const total = parseInt(parts[0], 10) * 3600 + parseInt(parts[1], 10) * 60;
      setTotalSeconds(total);
      setSecondsLeft(total);

      const id = setInterval(() => {
        setSecondsLeft((prevSeconds) => {
          if (prevSeconds <= 1) {
            clearInterval(id);
            return 0;
          }
          return prevSeconds - 1;
        });
      }, 1000);
      setIntervalId(id);
    } else {
      if (intervalId) {
        clearInterval(intervalId);
        setIntervalId(null);
      }
      setSecondsLeft(0);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [sessionStatus, time]);

  const renderProgressBar = () => {
    const percentage = totalSeconds > 0 ? (secondsLeft / totalSeconds) * 100 : 0;
    return (
      <div style={{ width: '100%', backgroundColor: '#ddd' }}>
        <div style={{ height: '20px', width: `${percentage}%`, backgroundColor: 'green' }}>
        </div>
      </div>
    );
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secondsLeft = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secondsLeft.toString().padStart(2, '0')}`;
  };

  return (
    <div>
      <h3>Progress Status</h3>
      {sessionStatus === 'on' && secondsLeft > 0 ? (
        <>
          <p>Time remaining: {formatTime(secondsLeft)}</p>
          {renderProgressBar()}
        </>
      ) : sessionStatus === 'on' && secondsLeft === 0 ? (
        <p>Session Goal has been reached</p>
      ) : (
        <p>Session is off. Set a time to start.</p>
      )}
    </div>
  );
};

export default ProgressField;
