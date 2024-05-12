import React, { useState, useEffect } from "react";
import "../../styles/popups/SessionHistory.scss";
import "../../styles/popups/InspectTask.scss";
import { api, handleError } from "helpers/api";
import PropTypes from "prop-types";
import { useNavigate, useParams } from "react-router-dom";
import { PopupHeader } from "../ui/PopupHeader";

const SessionHistory = ({ isOpen, onClose, sessionStatus }) => {
  const [teamName, setTeamName] = useState();
  const { teamId } = useParams();
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("id");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await api.get(`/api/v1/teams/${teamId}/sessions`, {
          headers: { Authorization: `${token}` },
        });
        const sessionsWithNumbers = response.data.map(
          (session, index, array) => {
            const startTime = new Date(session.startDateTime + "Z");
            const formattedStart = `${startTime
              .getDate()
              .toString()
              .padStart(2, "0")}.${(startTime.getMonth() + 1)
              .toString()
              .padStart(2, "0")}.${startTime
              .getFullYear()
              .toString()
              .slice(-2)}, ${startTime
              .getHours()
              .toString()
              .padStart(2, "0")}:${startTime
              .getMinutes()
              .toString()
              .padStart(2, "0")}:${startTime
              .getSeconds()
              .toString()
              .padStart(2, "0")}`;

            let endTimeDisplay = "Ongoing";
            let duration = "Ongoing";
            if (session.endDateTime) {
              const endTime = new Date(session.endDateTime + "Z");
              endTimeDisplay = `${endTime
                .getDate()
                .toString()
                .padStart(2, "0")}.${(endTime.getMonth() + 1)
                .toString()
                .padStart(2, "0")}.${endTime
                .getFullYear()
                .toString()
                .slice(-2)}, ${endTime
                .getHours()
                .toString()
                .padStart(2, "0")}:${endTime
                .getMinutes()
                .toString()
                .padStart(2, "0")}:${endTime
                .getSeconds()
                .toString()
                .padStart(2, "0")}`;

              const difference = endTime - startTime;
              const hours = Math.floor(difference / (1000 * 60 * 60));
              const minutes = Math.floor(
                (difference % (1000 * 60 * 60)) / (1000 * 60)
              );
              const seconds = Math.floor((difference % (1000 * 60)) / 1000);
              duration = `${hours.toString().padStart(2, "0")}:${minutes
                .toString()
                .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
            }

            return {
              ...session,
              sessionId: array.length - index,
              startDateTime: formattedStart,
              endDateTime: endTimeDisplay,
              duration,
            };
          }
        );
        setSessions(sessionsWithNumbers);
      } catch (error) {
        setError("Something went wrong. Please try again");
      }
    };

    fetchSessions();
  }, [sessionStatus, isOpen]);

  if (!isOpen) return null;

  const doClose = () => {
    setError("");
    onClose();
  };

  return (
    <div className="SessionHistory overlay" onClick={doClose}>
      <div
        className="SessionHistory content"
        onClick={(e) => e.stopPropagation()}
      >
        <PopupHeader onClose={onClose} title="Team Sessions" />
        {error && <p>{error}</p>}
        {!error && sessions.length !== 0 && (
          <div>
            <ul className="SessionHistory list">
              {sessions.map((session) => (
                <li className="SessionHistory listItem" key={session.sessionId}>
                  <strong>Session:</strong> {session.sessionId}
                  <br />
                  <div className="SessionHistory details">
                    <div>
                      <strong>Start:</strong> {session.startDateTime}
                    </div>
                    <div>
                      <strong>End:</strong> {session.endDateTime}
                    </div>
                    <div>
                      <strong>Goal:</strong> {session.goalMinutes} minutes
                    </div>
                    <div>
                      <strong>Total Time:</strong> {session.duration}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
        {!error && sessions.length === 0 && (
          <div style={{ marginBottom: "20px" }}>
            This team has no sessions yet.
            <br /> Better get started!
          </div>
        )}
      </div>
    </div>
  );
};

SessionHistory.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  sessionStatus: PropTypes.string,
};

export default SessionHistory;
