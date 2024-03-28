import React from "react";
import { useParams } from "react-router-dom";
import "styles/views/TeamsOverview.scss";
import BaseContainer from "components/ui/BaseContainer";
import "styles/views/TeamDashboard.scss";

const TeamDashboard = () => {
  const { teamId } = useParams();

  return (
    <BaseContainer>
      <div className="team-dashboard container">
        <h2>This is the dashboard for team {teamId}</h2>
        <div className="team-dashboard grid">
          <div
            className="team-dashboard box"
            style={{ gridArea: "1 / 1 / 2 / 2" }}
          >
            Session Field
          </div>
          <div
            className="team-dashboard box"
            style={{ gridArea: "2 / 1 / 20 / 2" }}
          >
            Team Members
          </div>
          <div
            className="team-dashboard box"
            style={{ gridArea: "1 / 2 / 2 / 3" }}
          >
            Progress Field
          </div>
          <div
            className="team-dashboard box"
            style={{ gridArea: "1 / 3 / 2 / 5" }}
          >
            Settings Button
          </div>
          <div
            className="team-dashboard box"
            style={{ gridArea: "2 / 2 / 20 / 5" }}
          >
            Task Field
          </div>
        </div>
      </div>
    </BaseContainer>
  );
};

export default TeamDashboard;
