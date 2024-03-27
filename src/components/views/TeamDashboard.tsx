import React from "react";
import { useParams } from "react-router-dom";
import "styles/views/TeamsOverview.scss";
import BaseContainer from "components/ui/BaseContainer";

const TeamDashboard = () => {
  const { teamId } = useParams();

  return (
    <BaseContainer>
      <div className="team-dashboard">
        <h2>This is the dashboard for team {teamId}</h2>
      </div>
    </BaseContainer>
  );
};

export default TeamDashboard;
