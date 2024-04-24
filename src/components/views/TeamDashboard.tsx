import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api, handleError } from "helpers/api";
import BaseContainer from "components/ui/BaseContainer";
import TeamDashboardBox from "components/ui/TeamDashboardBox";
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
      fetchStatus();
    });

    channel.bind("task-update", () => {
      fetchTeamTasks();
      document.dispatchEvent(new CustomEvent("checkBoxChange"));
    });

    channel.bind("team-update", (data: { userId: string }) => {
      if (data.userId !== localStorage.getItem("id")) {
        fetchTeamMembers();
      }
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
      const team = response.data.find((team) => team.teamId === numericTeamId);

      const teamName = team ? team.name : "Team Name not found!";
      const teamDesc = team ? team.description : "Team Description not found!";
      setTeamName(teamName);
      setTeamDesc(teamDesc);
    } catch (error) {
      console.error(`Error fetching team's name: ${handleError(error)}`);
    }
  };

  function minutesToTime(minutes) {
    let hours = Math.floor(minutes / 60);
    let mins = minutes % 60;

    return `${hours.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}`;
  }
  const fetchStatus = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication token is missing");
      }

      const response = await api.get(`/api/v1/teams/${teamId}/sessions`, {
        headers: { Authorization: `${token}` },
      });

      const sessions = response.data;
      if (!sessions || sessions.length === 0) {
        setSessionStatus("off");
        setGoalMinutes("00:30");
        setStartDateTime(null);
        setTotalTime("00:00");

        return;
      }

      let totalMinutes = 0;
      sessions.forEach((session) => {
        if (session.endDateTime) {
          const startTime = new Date(session.startDateTime).getTime();
          const endTime = new Date(session.endDateTime).getTime();
          const diffMinutes = (endTime - startTime) / (1000 * 60);
          totalMinutes += diffMinutes;
        }
      });

      const formattedTotalTime = minutesToTime(Math.round(totalMinutes));
      setTotalTime(formattedTotalTime);

      const mostRecentSession = sessions[0];
      if (mostRecentSession) {
        const status =
          mostRecentSession.startDateTime && !mostRecentSession.endDateTime
            ? "on"
            : "off";
        setSessionStatus(status);
        const formattedTime = minutesToTime(
          mostRecentSession.goalMinutes || 30
        );
        setGoalMinutes(formattedTime);
        setStartDateTime(
          mostRecentSession.startDateTime ||
            new Date().toISOString().substring(11, 16)
        );
      }
    } catch (error) {
      console.log(
        `Error fetching initial session status: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  };

  useEffect(() => {
    fetchTeamMembers();
    fetchTeamTasks();
    fetchTeamInfo();
  }, [teamId, token]);

  useEffect(() => {
    const updateTaskStatus = async () => {
      if (sessionStatus === "off") {
        try {
          // Filter tasks that need their status updated to 'DONE'
          const tasksToUpdate = teamTasks.filter(task => task.status === "IN_SESSION_DONE");

          const updates = tasksToUpdate.map(task => {
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
          });

          await Promise.all(updates);
          console.log("Tasks statuses updated to DONE");

          // Update the local state to reflect these changes
          setTeamTasks(prevTasks => prevTasks.map(task => ({
            ...task,
            status: task.status === "IN_SESSION_DONE" ? "DONE" : task.status
          })));
        } catch (error) {
          console.error(`Error updating task statuses: ${handleError(error)}`);
        }
      }
    };

    updateTaskStatus();
  }, [sessionStatus, teamTasks]);


  return (
    <BaseContainer>
      <div className="team-dashboard container">
        <div className="team-dashboard grid">
          <TeamDashboardBox
            startRow={1}
            startColumn={1}
            endRow={2}
            endColumn={2}
          >
            <div className="team-dashboard statusBox">
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
            </div>
          </TeamDashboardBox>
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
            className="team-dashboard box"
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
              <div className="team-dashboard description">{teamDesc}</div>
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
