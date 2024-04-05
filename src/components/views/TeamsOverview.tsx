import React, { useState, useEffect } from "react";
import { api, handleError } from "helpers/api";
import User from "models/User";
import { useNavigate } from "react-router-dom";
import { Button } from "components/ui/Button";
import "styles/views/TeamsOverview.scss";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import CreateTeam from "../popups/CreateTeam";

const TeamsOverview = () => {
  const [userTeams, setUserTeams] = useState([]);
  const navigate = useNavigate();
  const [isCreateTeamOpen, setCreateTeamOpen] = useState(false);

  useEffect(() => {
    const fetchUserTeams = async () => {
      try {
        const response = await api.get("/teams");
        setUserTeams(response.data);
      } catch (error) {
        console.error("Error fetching user teams:", error);
      }
    };

    fetchUserTeams();

    const fakeUserTeams = [
      { id: 1, name: "The best team" },
      { id: 2, name: "SoPra" },
      { id: 3, name: "Homies" },
      { id: 4, name: "Work: 1" },
      { id: 5, name: "Work: 7" },
      { id: 6, name: "Adoption Center" },
      { id: 7, name: "xXDogWalkersXx" },
      { id: 8, name: "datenight_planers" },
      { id: 9, name: "Dumbledore's Armee" },
    ];
    setUserTeams(fakeUserTeams);
  }, []);

  const openCreateTeam = () => {
    setCreateTeamOpen(true);
  };

  const closeCreateTeam = () => {
    setCreateTeamOpen(false);
  };

  const goTeam = (teamid) => {
    navigate(`/teams/${teamid}`); //change routing to point at created team
  };

  return (
    <BaseContainer>
      <div className="teams-overview container">
        <div className="teams-overview grid">
          {userTeams.map((team) => (
            <Button key={team.id} onClick={() => navigate(`/teams/${team.id}`)}>
              {team.name} - id: {team.id}
            </Button>
          ))}
          <Button className="green-button" onClick={openCreateTeam}>
            Create Team
          </Button>
          <CreateTeam
            isOpen={isCreateTeamOpen}
            onClose={closeCreateTeam}
            onCreateTeamClick={goTeam}
          />
        </div>
      </div>
    </BaseContainer>
  );
};

TeamsOverview.propTypes = {
  height: PropTypes.string,
};

export default TeamsOverview;
