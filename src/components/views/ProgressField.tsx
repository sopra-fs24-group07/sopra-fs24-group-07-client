import React, { useEffect, useState } from "react";
import { api } from "helpers/api";

interface ProgressFieldProps {
  sessionStatus: string;
  teamId: string;  // Assuming teamId is passed as a prop now
}

const ProgressField: React.FC<ProgressFieldProps> = ({ sessionStatus, teamId }) => {
  const [secondsLeft, setSecondsLeft] = useState<number>(0);
  const [totalSeconds, setTotalSeconds] = useState<number>(0);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const fetchSessionDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Authentication token is missing");
        }
        const response = await api.get(`/api/v1/teams/${teamId}/sessions/`, {
          headers: { Authorization: "${token}" },
        });
        const { startTime, goalTime } = response.data;
        const start = new Date(startTime);
        const now = new Date();
        const elapsed = (now.getTime() - start.getTime()) / 1000;
        const total = goalTime * 60;  // Assuming goalTime is in minutes from API

        setTotalSeconds(total);
        setSecondsLeft(total - elapsed > 0 ? total - elapsed : 0);

        if (sessionStatus === "on" && total - elapsed > 0) {
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
        }
      } catch (error) {
        console.error("Failed to fetch session details:", error);
      }
    };

    if (sessionStatus === "on") {
      fetchSessionDetails();
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
  }, [sessionStatus, teamId]);

  const renderProgressBar = () => {
    const percentage = totalSeconds > 0 ? (secondsLeft / totalSeconds) * 100 : 0;

    return (
      <div style={{ width: "100%", backgroundColor: "#ddd" }}>
        <div style={{ height: "20px", width: `${percentage}%`, backgroundColor: "green" }}>
        </div>
      </div>
    );
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secondsRem = seconds % 60;

    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secondsRem.toString().padStart(2, "0")}`;
  };

  return (
    <div>
      <h3>Progress Status</h3>
      {sessionStatus === "on" && secondsLeft > 0 ? (
        <>
          <p>Time remaining: {formatTime(secondsLeft)}</p>
          {renderProgressBar()}
        </>
      ) : sessionStatus === "on" && secondsLeft === 0 ? (
        <p>Session Goal has been reached</p>
      ) : (
        <p>Session is off. Set a time to start.</p>
      )}
    </div>
  );
};

export default ProgressField;
