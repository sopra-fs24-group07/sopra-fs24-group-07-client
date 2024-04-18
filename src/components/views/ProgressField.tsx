import React, { useState, useEffect } from 'react';

interface ProgressFieldProps {
  sessionStatus: string;
  goalMinutes: string;
  startDateTime?: string;
}

const ProgressField: React.FC<ProgressFieldProps> = ({ sessionStatus, goalMinutes, startDateTime }) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
      const timerId = setInterval(() => {
        setCurrentTime(new Date());
      }, 1000);

      return () => clearInterval(timerId);
  }, []);

  const calculateRemainingTime = () => {
    if (!startDateTime) {
      return { remainingTime: "00:00:00", progress: 0 };
    }

    const startTime = new Date(startDateTime);
    const elapsedTimeMs = currentTime.getTime() - startTime.getTime();
    const goalTimeMinutes = goalMinutes.split(':').map(Number);
    const goalTimeMs = (goalTimeMinutes[0] * 60 + goalTimeMinutes[1]) * 60 * 1000;
    const remainingTimeMs = goalTimeMs - elapsedTimeMs;
    const progress = Math.max(0, Math.min(100, (elapsedTimeMs / goalTimeMs) * 100));

    const hours = Math.floor(remainingTimeMs / (1000 * 60 * 60));
    const minutes = Math.floor((remainingTimeMs % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((remainingTimeMs % (1000 * 60)) / 1000);

    if (remainingTimeMs > 0) {
      return {
        remainingTime: `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`,
        progress
      };
    } else {
      return {
        remainingTime: "00:00:00",
        progress: 100
      };
    }
  };

  if (sessionStatus === 'on' && startDateTime) {
    const { remainingTime, progress } = calculateRemainingTime();
    return (
      <div>
        <h2>Session Progress</h2>
        <div style={{ width: '100%', margin: '10px 0', fontSize: '16px' }}>
          Time Remaining: {remainingTime}
          <div style={{ width: '100%', backgroundColor: '#f4cdec', borderRadius: "10px" }}>
            <div style={{ width: `${progress}%`, height: '20px', backgroundColor: '#cdf9da', borderRadius: "10px" }}></div>
          </div>
        </div>
      </div>
    );
  } else {
    const { remainingTime, progress } = calculateRemainingTime();
    return (
      <div>
        <h2>Team Progress</h2>
        <p>TBU</p>
      </div>
    );
  }
};

export default ProgressField;
