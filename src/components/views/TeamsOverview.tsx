import React, { useState, useEffect } from "react";
import { api, handleError } from "helpers/api";
import User from "models/User";
import { useNavigate } from "react-router-dom";
import { Button } from "components/ui/Button";
import "styles/views/TeamsOverview.scss";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";

const TeamsOverview = () => {
  const [userTeams, setUserTeams] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserTeams = async () => {
      try {
        const response = await api.get("/user/teams");
        setUserTeams(response.data);
      } catch (error) {
        console.error("Error fetching user teams:", error);
      }
    };

    fetchUserTeams();

    const fakeUserTeams = [
      { id: 1, name: "Team 1" },
      { id: 2, name: "Team 2" },
      { id: 3, name: "Team 3" },
      { id: 4, name: "Team 4" },
      { id: 5, name: "Team 5" },
      { id: 6, name: "Team 6" },
      { id: 7, name: "Team 7" },
      { id: 8, name: "Team 8" },
      { id: 9, name: "Team 9" },
      // Add more fake teams as needed
    ];
    setUserTeams(fakeUserTeams);
  }, []);

  const handleCreateTeam = () => {
    navigate("/create-team");
  };

  return (
    <BaseContainer>
      <div className="teams-overview container">
        <div className="teams-overview grid">
          <Button onClick={handleCreateTeam}>Create new team</Button>
          {userTeams.map((team) => (
            <Button key={team.id} onClick={() => navigate(`/team/${team.id}`)}>
              {team.name}
            </Button>
          ))}
        </div>
      </div>
    </BaseContainer>
  );
};

export default TeamsOverview;
