import React, { useState, useEffect } from "react";
import "../../styles/popups/SessionHistory.scss";
import "../../styles/popups/InspectTask.scss";
import { api, handleError } from "helpers/api";
import PropTypes from "prop-types";
import { Button } from "components/ui/Button";
import { useNavigate, useParams } from "react-router-dom";

const SessionHistory = ({ isOpen, onClose, sessionStatus}) => {
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
        setSessions(response.data);

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
      <div className="SessionHistory content" onClick={(e) => e.stopPropagation()}>
        <div className="SessionHistory header">
          <h2 className="SessionHistory headline">Team Sessions</h2>
          <Button className="red-button" onClick={doClose}>
            Close
          </Button>
        </div>
        {error && <p>{error}</p>}
        {!error && (
            <div>
              <ul className="SessionHistory list">
                {sessions.map((session) => (
                  <li className="SessionHistory listItem" key={session.sessionId}>
                    <strong>Session:</strong> {session.sessionId}<br />
                    <div className="SessionHistory details">
                      <div><strong>Start:</strong> {session.startDateTime}</div>
                      <div><strong>End:</strong> {session.endDateTime}</div>
                      <div><strong>Goal:</strong> {session.goalMinutes} minutes</div>
                    </div>
                  </li>
                ))}
              </ul>
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
