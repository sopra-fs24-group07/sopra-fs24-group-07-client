import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api, handleError } from "helpers/api";
import BaseContainer from "components/ui/BaseContainer";
import TeamDashboardBox from "components/ui/TeamDashboardBox";
import TeamDashboardSessionBox from "components/ui/TeamDashboardSessionBox";
import KanbanBoard from "components/ui/KanbanBoard";
import StatusComponent from "components/views/StatusComponent";
import ProgressField from "components/views/ProgressField";
import "styles/views/TeamsOverview.scss";
import "styles/views/TeamDashboard.scss";
import TeamSettings from "components/popups/TeamSetting";
import { Button } from "components/ui/Button";
import VoiceChat from "components/ui/VoiceChat";
import SessionTaskBoard from "../ui/SessionTaskBoard";
import Pusher from "pusher-js";
import MemberCard from "components/ui/MemberCard";

const TeamDashboard: React.FC = () => {
  const { teamId } = useParams<{ teamId: string }>();
  const [sessionStatus, setSessionStatus] = useState<string>("off");
  const [goalMinutes, setGoalMinutes] = useState("00:30");
  const [totalTime, setTotalTime] = useState(null);
  const [startDateTime, setStartDateTime] = useState<string>(null);
  const [userData, setUserData] = useState<any[]>([]);
  const [teamTasks, setTeamTasks] = useState<any[]>([]);
  const [teamName, setTeamName] = useState<any[]>([]);
  const [teamDesc, setTeamDesc] = useState<any[]>([]);
  const token = localStorage.getItem("token") || "";
  const userId = localStorage.getItem("id");
  const [isTeamSettingsOpen, setTeamSettingsOpen] = useState(false);
  const [checkedTasks, setCheckedTasks] = useState(new Set());
  const navigate = useNavigate();
  const [isLeave, setIsLeave] = useState<boolean>(false);

  useEffect(() => {
    const pusher = new Pusher(process.env.REACT_APP_PUSHER_KEY, {
      cluster: "eu",
      forceTLS: true,
    });

    const channel = pusher.subscribe(`team-${teamId}`);
    channel.bind("session-update", (data: { status: string }) => {
      setSessionStatus(data.status);
      window.location.reload();
    });

    channel.bind("task-update", () => {
      window.location.reload();
    });

    channel.bind("team-update", (data: { userId: string }) => {
      if (data.userId !== localStorage.getItem("id")) {
        window.location.reload();
      }
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [teamId, setSessionStatus]);

  useEffect(() => {
    const pusher = new Pusher(process.env.REACT_APP_PUSHER_KEY, {
      cluster: "eu",
      forceTLS: true,
    });

    const channel = pusher.subscribe(`team-${teamId}`);
    channel.bind("session-update", (data: { status: string }) => {
      setSessionStatus(data.status);
      window.location.reload();
    });

    channel.bind("task-update", (data: { status: string }) => {
      window.location.reload();
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [teamId, setSessionStatus]);

  const openTeamSettings = () => {
    setTeamSettingsOpen(true);
  };

  const closeTeamSettings = () => {
    setTeamSettingsOpen(false);
    if (isLeave) {
      navigate("/teams");
      setIsLeave(false);
    }
  };

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const response = await api.get(`/api/v1/teams/${teamId}/users`, {
          headers: {
            Authorization: `${token}`,
          },
        });
        const foundUser = response.data.find(
          (user) => user.userId === parseInt(userId)
        );
        if (!foundUser) {
          navigate("/teams");
        }
        setUserData(response.data);
      } catch (error) {
        console.error(`Error fetching team's users: ${handleError(error)}`);
      }
    };

    const fetchTeamTasks = async () => {
      try {
        const response = await api.get(`/api/v1/teams/${teamId}/tasks`, {
          headers: {
            Authorization: `${token}`,
          },
        });
        setTeamTasks(response.data);
      } catch (error) {
        console.error(`Error fetching team's tasks: ${handleError(error)}`);
      }
    };

    const fetchTeamInfo = async () => {
      let userId = localStorage.getItem("id");
      try {
        const response = await api.get(`/api/v1/users/${userId}/teams`, {
          headers: {
            Authorization: `${token}`,
          },
        });
        const numericTeamId = Number(teamId);
        const team = response.data.find(
          (team) => team.teamId === numericTeamId
        );

        const teamName = team ? team.name : "Team Name not found!";
        const teamDesc = team
          ? team.description
          : "Team Description not found!";
        setTeamName(teamName);
        setTeamDesc(teamDesc);
      } catch (error) {
        console.error(`Error fetching team's name: ${handleError(error)}`);
      }
    };

    fetchTeamMembers();
    fetchTeamTasks();
    fetchTeamInfo();
  }, [teamId, token]);

  useEffect(() => {
    const updateTaskStatus = async () => {
      if (sessionStatus === "off" && checkedTasks.size > 0) {
        try {
          const updates = Array.from(checkedTasks).map((taskId) => {
            const task = teamTasks.find((t) => t.taskId === taskId);
            if (task) {
              task.status = "DONE";
              const requestBody = JSON.stringify(task);

              return api.put(
                `/api/v1/teams/${teamId}/tasks/${task.taskId}`,
                requestBody,
                {
                  headers: {
                    Authorization: `${token}`,
                  },
                }
              );
            }
          });

          await Promise.all(updates);
          console.log("Tasks statuses updated to DONE");
          setCheckedTasks(new Set());
        } catch (error) {
          console.error(`Error updating task statuses: ${handleError(error)}`);
        }
      }
    };

    updateTaskStatus();
  }, [sessionStatus, checkedTasks]);

  return (
    <BaseContainer>
      <div className="team-dashboard container">
        <div className="team-dashboard grid">
          <TeamDashboardSessionBox
            startRow={1}
            startColumn={1}
            endRow={2}
            endColumn={2}
          >
            <StatusComponent
              sessionStatus={sessionStatus}
              setSessionStatus={setSessionStatus}
              goalMinutes={goalMinutes}
              setGoalMinutes={setGoalMinutes}
              startDateTime={startDateTime}
              setStartDateTime={setStartDateTime}
              totalTime={totalTime}
              setTotalTime={setTotalTime}
              teamName={teamName}
            />
          </TeamDashboardSessionBox>
          <TeamDashboardBox
            startRow={2}
            startColumn={1}
            endRow={20}
            endColumn={2}
          >
            {sessionStatus === "off" && (
              <div className="memContainer">
                Team Members
                {userData.map((member) => (
                  <MemberCard
                    key={member.id}
                    MemberName={member.username}
                    className="memCards"
                  ></MemberCard>
                ))}
              </div>
            )}
            {sessionStatus === "on" && <VoiceChat />}
          </TeamDashboardBox>
          <TeamDashboardBox
            startRow={1}
            startColumn={2}
            endRow={2}
            endColumn={3}
          >
            <ProgressField
              sessionStatus={sessionStatus}
              goalMinutes={goalMinutes}
              startDateTime={startDateTime}
              totalTime={totalTime}
            />
          </TeamDashboardBox>
          <TeamDashboardBox
            startRow={1}
            startColumn={3}
            endRow={2}
            endColumn={5}
          >
            <div className="team-dashboard settingsBox">
              <Button
                className="team-dashboard settingsButton"
                onClick={openTeamSettings}
              >
                Team Settings
              </Button>
              {teamDesc}
            </div>
          </TeamDashboardBox>
          <TeamDashboardBox
            startRow={2}
            startColumn={2}
            endRow={20}
            endColumn={5}
          >
            {sessionStatus === "off" && (
              <KanbanBoard
                teamTasks={teamTasks}
                sessionStatus={sessionStatus}
              />
            )}
            {sessionStatus === "on" && (
              <SessionTaskBoard
                teamId={teamId}
                teamTasks={teamTasks.filter(
                  (task) =>
                    task.status === "IN_SESSION" ||
                    task.status === "IN_SESSION_DONE"
                )}
                sessionStatus={sessionStatus}
                checkedTasks={checkedTasks}
                setCheckedTasks={setCheckedTasks}
              />
            )}
          </TeamDashboardBox>
        </div>
        <TeamSettings
          isOpen={isTeamSettingsOpen}
          onClose={closeTeamSettings}
          isLeave={isLeave}
          setIsLeave={setIsLeave}
        />
      </div>
    </BaseContainer>
  );
};

export default TeamDashboard;
