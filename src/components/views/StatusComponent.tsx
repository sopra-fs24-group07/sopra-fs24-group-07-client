import React, { useState, useEffect } from 'react';
import Pusher from 'pusher-js';
import { api } from "helpers/api";
import { useParams } from "react-router-dom";
import { Button } from "components/ui/Button";

interface StatusComponentProps {
  sessionStatus: string;
  setSessionStatus: (status: string) => void;
  time: string;
  setTime: (time: string) => void;
}

const StatusComponent: React.FC<StatusComponentProps> = ({ sessionStatus, setSessionStatus, time, setTime }) => {
  const [error, setError] = useState<string>('');
  const { teamId } = useParams<{ teamId: string }>();


  useEffect(() => {
    /* Is required later when backend is implemented (needs changing)
    const fetchInitialStatus = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await api.get(`/api/v1/session?teamId=${ teamId }`, {
          headers: {
            Authorization: `${token}`,
          },
        });
        setSessionStatus(response.data.status);
      } catch (error) {
        setError(`Error fetching initial session status: ${error.response ? error.response.data.message : error.message}`);
      }
    };

    fetchInitialStatus();
   */

    const pusher = new Pusher("98eb073ecf324dc1bf65", {
      cluster: 'eu',
      forceTLS: true
    });

    const channel = pusher.subscribe(`team-${teamId}`);
    channel.bind('session-update', (data: { status: string }) => {
      setSessionStatus(data.status);
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [teamId, setSessionStatus]);

  const updateStatus = async (status: string) => {
    try {
      let token = localStorage.getItem("token") || "";
      const response = await api.post(`/api/v1/${status === 'on' ? 'session-start' : 'session-stop'}`, teamId, {
        headers: {
          Authorization: `${token}`,
        },
      });
      console.log('Status updated successfully to:', status);
      setError('');
    } catch (error) {
      setError(`Error updating status: ${error.response ? error.response.data.message : error.message}`);
    }
  };

  return (
    <div>
      <h3>Session: {sessionStatus}</h3>
      <div className="sessionbox">
        Set Goal:
        <input
          className="timeInput"
          placeholder="Enter time Goal"
          value={time}
          type="time"
          onChange={(e) => setTime(e.target.value)}
          disabled={sessionStatus === 'on'}
        />
        {sessionStatus === 'off' ? (
          <Button className="green-button" onClick={() => updateStatus('on')}>Start Group Session</Button>
        ) : (
          <Button className="red-button" onClick={() => updateStatus('off')}>Stop Group Session</Button>
        )}
      </div>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default StatusComponent;
