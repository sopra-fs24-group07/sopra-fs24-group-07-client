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
  const [tooltip, setTooltip] = useState({
    visible: false,
    content: "",
    position: { top: 0, left: 0 },
  });
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("id");
  const location = useLocation();
  const [showTutorial, setShowTutorial] = useState(false);
  const [firstTime, setFirstTime] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("showTutorial") === "true") {
      setShowTutorial(true);
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

  const showTooltip = (content, position) => {
    const offset = { top: position.top + 16, left: position.left + 16 };
    setTooltip({ visible: true, content, position: offset });
  };

  const hideTooltip = () => {
    setTooltip({ visible: false, content: "", position: { top: 0, left: 0 } });
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
              onMouseEnter={(e) =>
                showTooltip(team.description, {
                  top: e.clientY,
                  left: e.clientX,
                })
              }
              onMouseLeave={hideTooltip}
              onClick={() => goTeam(team.teamId)}
              inSession={team.inSession}
            >
              {team.name}
            </Button>
          ))}
          <Button
            className="team green-button"
            onClick={openCreateTeam}
            onMouseEnter={(e) =>
              showTooltip("Create a new team!", {
                top: e.clientY,
                left: e.clientX,
              })
            }
            onMouseLeave={hideTooltip}
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
          {tooltip.visible && (
            <div
              className="tooltip"
              style={{ top: tooltip.position.top, left: tooltip.position.left }}
            >
              {tooltip.content}
            </div>
          )}
        </div>
      </div>
    </BaseContainer>
  );
};

export default TeamsOverview;
