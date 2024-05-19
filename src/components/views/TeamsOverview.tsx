import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { api, handleError } from "helpers/api";
import BaseContainer from "components/ui/BaseContainer";
import { Button } from "components/ui/Button";
import CreateTeam from "../popups/CreateTeam";
import "styles/views/TeamsOverview.scss";
import TutorialPopup from "../popups/Tutorial";

const TeamsOverview = () => {
  const [userTeams, setUserTeams] = useState([]);
  const [userName, setUserName] = useState("");
  const [isCreateTeamOpen, setCreateTeamOpen] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("id");
  const location = useLocation();
  const [showTutorial, setShowTutorial] = useState(false);
  const [firstTime, setFirstTime] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("showTutorial") === "true") {
      setShowTutorial(true); // Assuming `setShowTutorial` sets state to show the tutorial popup
      setFirstTime(true);
    }
  }, [location]);

  useEffect(() => {
    const fetchUserTeams = async () => {
      try {
        const response = await api.get(`/api/v1/users/${userId}/teams`, {
          headers: { Authorization: `${token}` },
        });
        const teams = response.data;

        const teamsWithStatus = await Promise.all(
          teams.map(async (team) => {
            const sessionResponse = await api.get(
              `/api/v1/teams/${team.teamId}/sessions`,
              {
                headers: { Authorization: `${token}` },
              }
            );

            const lastSession = sessionResponse.data.slice(0)[0];
            //if a team has no sessions, isFinished should be true
            const isFinished = !lastSession || !!lastSession.endDateTime;

            return {
              ...team,
              inSession: isFinished ? "notSession" : "inSession",
            };
          })
        );
        setUserTeams(teamsWithStatus);
      } catch (error) {
        console.error("Error fetching user teams:", error);
      }
    };

    const fetchUserInfo = async () => {
      try {
        const response = await api.get(`/api/v1/users/${userId}`, {
          headers: { Authorization: `${token}` },
        });
        setUserName(response.data.username);
      } catch (error) {
        console.error(`Error fetching user info: ${handleError(error)}`);
      }
    };

    fetchUserTeams();
    fetchUserInfo();
  }, [userId, token]);

  const openCreateTeam = () => setCreateTeamOpen(true);
  const closeCreateTeam = () => setCreateTeamOpen(false);

  const goTeam = (teamId) => {
    if (firstTime) {
      navigate(`/teams/${teamId}?showTutorial=true`);
      setFirstTime(false);
    } else {
      navigate(`/teams/${teamId}`);
    }
  };

  return (
    <BaseContainer>
      <h1 className="teams-overview header">{userName}&#39;s Teams</h1>
      <div className="teams-overview container">
        <div className="teams-overview grid">
          {userTeams.map((team) => (
            <Button
              className="team"
              key={team.teamId}
              title={team.description}
              onClick={() => goTeam(team.teamId)}
              inSession={team.inSession}
            >
              {team.name}
            </Button>
          ))}
          <Button
            className="team green-button"
            onClick={openCreateTeam}
            title="Create a new team!"
          >
            Create Team
          </Button>
          <CreateTeam
            isOpen={isCreateTeamOpen}
            onClose={closeCreateTeam}
            onCreateTeamClick={goTeam}
          />
          <TutorialPopup
            isOpen={showTutorial}
            onClose={() => setShowTutorial(false)}
          />
        </div>
      </div>
    </BaseContainer>
  );
};

export default TeamsOverview;
