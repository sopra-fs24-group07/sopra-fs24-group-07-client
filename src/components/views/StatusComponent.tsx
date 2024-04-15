import React, { useEffect, useState } from 'react';
import Pusher from 'pusher-js';
import { api } from "helpers/api";
import { Button } from "components/ui/Button";
import { useParams } from "react-router-dom";
import PropTypes from "prop-types";

const FormField = (props) => {
  return (
    <input
      className="timeInput"
      placeholder="Enter time Goal"
      value={props.value}
      type="time"
      onChange={(e) => props.onChange(e.target.value)}
    />
  );
};

//check for numer as input
FormField.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
};

const StatusComponent = () => {
  const [sessionStatus, setSessionStatus] = useState('off');
  const [error, setError] = useState('');
  const { teamId } = useParams();
  const [time, setTime] = useState('00:30');

  useEffect(() => {
    const pusher = new Pusher("98eb073ecf324dc1bf65", {
      cluster: 'eu',
      forceTLS: true
    });

    const channel = pusher.subscribe(`team-${teamId}`);
    console.log("Channel", channel);
    channel.bind('session-update', data => {
      setSessionStatus(data.status);
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [teamId]);

  const updateStatus = async (status) => {
    try {
      let token = localStorage.getItem("token");

      /* Could implement something like this
      const currentDate = new Date();
      const startTime = currentDate.getTime();

      const requestBody = JSON.stringify({
        teamId: teamId,
        startTime: startTime
      });
       */

      const response = await api.post(`/api/v1/${status === 'on' ? 'session-start' : 'session-stop'}`, teamId, {
        headers: {
          Authorization: `${token}`,
        },
      });
      console.log('Status updated successfully to:', status);
      setError('');
    } catch (error) {
      setError(`Error updating status: ${error.response ? error.response.data.message : error.message}`);
      console.error('Error updating status:', error);
    }
  };

  return (
    <div>
      <h3>Session: {sessionStatus}</h3>
      <div className="timeGoalBox">
        Time Goal:
        <FormField value={time} onChange={(t) => setTime(t)} />
        {sessionStatus === 'off' && (
          <Button width="100%" onClick={() => updateStatus('on')}>
            Start Group Session
          </Button>
        )}
        {sessionStatus === 'on' && (
          <Button width="100%" onClick={() => updateStatus('off')}>
            Stop Group Session
          </Button>
        )}
      </div>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default StatusComponent;