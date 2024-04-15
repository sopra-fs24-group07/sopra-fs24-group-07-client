import React, { useEffect, useState } from 'react';
import Pusher from 'pusher-js';
import { api } from "helpers/api";
import { Button } from "components/ui/Button";
import { useParams } from "react-router-dom";

const StatusComponent = () => {
  const [lampStatus, setLampStatus] = useState('Unknown');
  const [error, setError] = useState('');
  const { teamId } = useParams(); // Get teamId from URL params

  useEffect(() => {
    const pusher = new Pusher("98eb073ecf324dc1bf65", {
      cluster: 'eu',
      forceTLS: true
    });

    const channel = pusher.subscribe(`team-${teamId}`);
    console.log("Channel", channel);
    channel.bind('lamp-update', data => {
      setLampStatus(data.color);
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [teamId]);

  const updateStatus = async (color) => {
    try {
      const requestBody = JSON.stringify({
        teamId: teamId,
      });

      const response = await api.post(`/api/v1/${color === 'green' ? 'start-lamp' : 'stop-lamp'}`, teamId);
      console.log('Status updated successfully to:', color);
      setError('');
    } catch (error) {
      setError(`Error updating status: ${error.response ? error.response.data.message : error.message}`);
      console.error('Error updating status:', error);
    }
  };

  return (
    <div>
      <h1>Current Status: {lampStatus}</h1>
      <Button onClick={() => updateStatus('green')}>Start</Button>
      <Button onClick={() => updateStatus('red')}>Stop</Button>
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default StatusComponent;