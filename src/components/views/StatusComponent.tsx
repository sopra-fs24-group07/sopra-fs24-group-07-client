import React, { useState, useEffect } from "react";
import Pusher from "pusher-js";
import { useParams } from "react-router-dom";
import { Button } from "components/ui/Button";
import { api } from "helpers/api";
import PropTypes from "prop-types";

interface StatusComponentProps {
  sessionStatus: string;
  setSessionStatus: (status: string) => void;
  time: string;
  setTime: (time: string) => void;
}

const StatusComponent: React.FC<StatusComponentProps> = ({ sessionStatus, setSessionStatus, time, setTime }) => {
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
          return;
        }

        const mostRecentSession = sessions[0];
        const status = mostRecentSession.startDateTime && !mostRecentSession.endDateTime ? "on" : "off";
        setSessionStatus(status);
      } catch (error) {
        setError(`Error fetching initial session status: ${error.response?.data?.message || error.message}`);
      }
    };

    fetchStatus();

    const pusherKey = "98eb073ecf324dc1bf65"; // Consider using environment variables here
    const pusher = new Pusher(pusherKey, {
      cluster: "eu",
      forceTLS: true,
    });

    const channel = pusher.subscribe(`team-${teamId}`);
    channel.bind("session-update", (data: { status: string }) => {
      setSessionStatus(data.status);
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [teamId, setSessionStatus]);

  const updateStatus = async (status: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Authentication token is missing");
        return;
      }

      const [hours, minutes] = time.split(":").map(Number);
      const totalMinutes = hours * 60 + minutes;
      const requestBody = { goalMinutes: totalMinutes };
      const endpoint = `/api/v1/teams/${teamId}/sessions`;
      const method = status === "on" ? "post" : "patch";

      await api[method](endpoint, requestBody, {
        headers: { Authorization: `${token}` },
      });

      console.log(`Status updated successfully to: ${status}`);
      setSessionStatus(status);
      setError("");
    } catch (error) {
      setError(`Error updating status: ${error.response?.data?.message || error.message}`);
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
          value={time}
          type="time"
          onChange={(e) => setTime(e.target.value)}
          disabled={sessionStatus === "on"}
        />
        {sessionStatus === "off" ? (
          <Button className="green-button" onClick={() => updateStatus("on")}>Start Group Session</Button>
        ) : (
          <Button className="red-button" onClick={() => updateStatus("off")}>Stop Group Session</Button>
        )}
      </div>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

StatusComponent.propTypes = {
  sessionStatus: PropTypes.string.isRequired,
  setSessionStatus: PropTypes.func.isRequired,
  time: PropTypes.string,
  setTime: PropTypes.func,
};

export default StatusComponent;
