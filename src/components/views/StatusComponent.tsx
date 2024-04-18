import React, { useState, useEffect } from "react";
import Pusher from "pusher-js";
import { useParams } from "react-router-dom";
import { Button } from "components/ui/Button";
import { api } from "helpers/api";
import PropTypes from "prop-types";
import "styles/views/TeamDashboard.scss";

interface StatusComponentProps {
  sessionStatus: string;
  setSessionStatus: (status: string) => void;
  goalMinutes: string;
  setGoalMinutes: (goalMinutes: string) => void;
  startDateTime: string;
  setStartDateTime: (startDateTime: string) => void;
  totalTime: string;
  setTotalTime: (totalTime: string) => void;
}

// Converts "HH:MM" to total minutes
function timeToMinutes(time) {
  const [hours, minutes] = time.split(":").map(Number);

  return hours * 60 + minutes;
}

// Converts total minutes to "HH:MM"
function minutesToTime(minutes) {
  let hours = Math.floor(minutes / 60);
  let mins = minutes % 60;

  return `${hours.toString().padStart(2, "0")}:${mins
    .toString()
    .padStart(2, "0")}`;
}

const StatusComponent: React.FC<StatusComponentProps> = ({
  sessionStatus,
  setSessionStatus,
  goalMinutes,
  setGoalMinutes,
  startDateTime,
  setStartDateTime,
  totalTime,
  setTotalTime,
}) => {
  const [error, setError] = useState<string>("");
  const { teamId } = useParams<{ teamId: string }>();

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Authentication token is missing");
        }

        const response = await api.get(`/api/v1/teams/${teamId}/sessions`, {
          headers: { Authorization: `${token}` },
        });

        const sessions = response.data;
        if (!sessions || sessions.length === 0) {
          setSessionStatus("off");
          setGoalMinutes("00:30");
          setStartDateTime(null);
          setTotalTime("00:00");

          return;
        }

        let totalMinutes = 0;
        sessions.forEach((session) => {
          if (session.endDateTime) {
            const startTime = new Date(session.startDateTime).getTime();
            const endTime = new Date(session.endDateTime).getTime();
            const diffMinutes = (endTime - startTime) / (1000 * 60);
            totalMinutes += diffMinutes;
          }
        });

        const formattedTotalTime = minutesToTime(Math.round(totalMinutes));
        setTotalTime(formattedTotalTime);

        const mostRecentSession = sessions[0];
        if (mostRecentSession) {
          const status =
            mostRecentSession.startDateTime && !mostRecentSession.endDateTime
              ? "on"
              : "off";
          setSessionStatus(status);
          const formattedTime = minutesToTime(
            mostRecentSession.goalMinutes || 30
          );
          setGoalMinutes(formattedTime);
          setStartDateTime(
            mostRecentSession.startDateTime ||
              new Date().toISOString().substring(11, 16)
          );
        }

        const pusher = new Pusher("98eb073ecf324dc1bf65", {
          cluster: "eu",
          forceTLS: true,
        });

        const channel = pusher.subscribe(`team-${teamId}`);
        channel.bind("session-update", (data: { status: string }) => {
          window.location.reload();
          setSessionStatus(data.status);
        });

        return () => {
          channel.unbind_all();
          channel.unsubscribe();
        };
      } catch (error) {
        setError(
          `Error fetching initial session status: ${
            error.response?.data?.message || error.message
          }`
        );
      }
    };

    fetchStatus();
  }, [
    teamId,
    setSessionStatus,
    setGoalMinutes,
    setStartDateTime,
    setTotalTime,
  ]);

  const updateStatus = async (status: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Authentication token is missing");

        return;
      }

      const totalMinutes = timeToMinutes(goalMinutes);

      const requestBody = { goalMinutes: totalMinutes };
      const method = status === "on" ? "post" : "patch";

      const response = await api[method](
        `/api/v1/teams/${teamId}/sessions`,
        requestBody,
        {
          headers: { Authorization: `${token}` },
        }
      );

      console.log(`Status updated successfully to: ${status}`);
      setSessionStatus(status);
      const startTime = response.data.startDateTime;
      setStartDateTime(startTime);
      const formattedTime = minutesToTime(response.data.goalMinutes || 30);
      if (status === "on") {
        setGoalMinutes(formattedTime);
      }
      setError("");
    } catch (error) {
      setError(
        `Error updating status: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  };

  return (
    <div>
      <h3>Session: {sessionStatus}</h3>
      <div className="sessionbox">
        Set Goal:
        <input
          className="timeInput"
          placeholder="Enter time goal"
          value={goalMinutes}
          type="time"
          onChange={(e) => setGoalMinutes(e.target.value || "00:00")}
          disabled={sessionStatus === "on"}
        />
        {sessionStatus === "off" ? (
          <Button className="green-button" onClick={() => updateStatus("on")}>
            Start Group Session
          </Button>
        ) : (
          <Button className="red-button" onClick={() => updateStatus("off")}>
            Stop Group Session
          </Button>
        )}
      </div>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

StatusComponent.propTypes = {
  sessionStatus: PropTypes.string.isRequired,
  setSessionStatus: PropTypes.func.isRequired,
  goalMinutes: PropTypes.string,
  setGoalMinutes: PropTypes.func.isRequired,
  totalTime: PropTypes.string,
  setTotalTime: PropTypes.func.isRequired,
  startDateTime: PropTypes.string,
  setStartDateTime: PropTypes.func.isRequired,
};

export default StatusComponent;
