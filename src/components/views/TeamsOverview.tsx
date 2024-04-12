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
  const token = sessionStorage.getItem("token");
  const [isCreateTeamOpen, setCreateTeamOpen] = useState(false);
  const userId = sessionStorage.getItem("id"); //todo change this depending on the api endpoint where we get the userId from the user token
  // dont forget to remove id from storage on logout
  // const [userId, setUserId] = useState(null); // new user Id set function, requires api call

  useEffect(() => {
    const fetchUserTeams = async () => {
      try {
        const response = await api.get(`/api/v1/users/${userId}/teams`, {
          headers: { Authorization: `${token}` },
        });
        setUserTeams(response.data);
      } catch (error) {
        console.error("Error fetching user teams:", error);
      }
    };

    fetchUserTeams();
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
