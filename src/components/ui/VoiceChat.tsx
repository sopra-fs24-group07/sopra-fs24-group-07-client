import React, { useState, useEffect } from "react";
import "../../styles/ui/VoiceChat.scss";
import { useParams } from "react-router-dom";
import { api, handleError } from "helpers/api";

import AgoraRTC from "agora-rtc-sdk-ng"; //RTC for voice transmitting
import AgoraRTM from "agora-rtm-sdk"; //RTM for Channels, Users, etc.
import BaseContainer from "./BaseContainer";
import { Button } from "./Button";

const Spinner = () => (
  <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent black background
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000, // Ensures it is on top of other elements
    }}
  >
    <div
      style={{
        width: "40px",
        height: "40px",
        border: "4px solid #f3f3f3",
        borderTop: "4px solid #3498db",
        borderRadius: "50%",
        animation: "spin 1s linear infinite",
      }}
    />
  </div>
);

function VoiceChat() {
  const APP_ID = "a55e8c2816d34eda92942fa9e808e843";
  const TOKEN = null;

  const [errorUserName, setErrorUserName] = useState("");
  const [errorGetTasks, setErrorGetTasks] = useState("");
  const [errorGeneral, setErrorGeneral] = useState("");

  //IDs for identification, which we will use the userId for
  let rtcUID;
  let rtmUID;
  let userId;

  //set as different IDs for each use-ase
  const setIds = async () => {
    rtcUID = parseInt(localStorage.getItem("id"));
    rtmUID = localStorage.getItem("id");
    userId = localStorage.getItem("id");
  };

  //the name of the room (a single task in our case)
  let roomName;

  //the published channel, we use teamId + roomName to make individual channels for teams
  let channel;

  //local AudioTrack for myself and remoteAudioTracks of the others
  let localAudioTrack;
  let remoteAudioTracks = {};

  //the Clients, which will be initialized later
  let rtcClient;
  let rtmClient;

  //to display the Spinner
  const [isLoading, setIsLoading] = useState(false);

  const initRTM = async (name, taskid) => {
    //init rtm client with app ID
    rtmClient = AgoraRTM.createInstance(APP_ID);
    await rtmClient.login({ uid: rtmUID, token: TOKEN });

    //add user to local attribute
    rtmClient.addOrUpdateLocalUserAttributes({
      name: name,
      userRtcUid: rtcUID.toString(),
    });

    //create the channel with roomName, teamId and them join
    channel = rtmClient.createChannel(
      taskid.toString() + roomName + teamId.toString()
    );
    await channel.join();

    // get the members that are in a channel
    getChannelMembers();

    //what happens if a user joins/leaves
    channel.on("MemberJoined", handleMemberJoined);
    channel.on("MemberLeft", handleMemberLeft);
  };

  const initRTC = async (taskid) => {
    rtcClient = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

    //handle user join/leave
    rtcClient.on("user-published", handleUserPublished);
    rtcClient.on("user-left", handleUserLeft);

    await rtcClient.join(
      APP_ID,
      taskid.toString() + roomName + teamId.toString(),
      TOKEN,
      rtcUID
    );

    //track and publish local audio track
    localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
    rtcClient.publish(localAudioTrack);
  };

  //get the users that are in the channel
  const getChannelMembers = async () => {
    let members = await channel.getMembers();

    for (let i = 0; members.length > i; i++) {
      let { name, userRtcUid } = await rtmClient.getUserAttributesByKeys(
        members[i],
        ["name", "userRtcUid"]
      );

      let newMember = `
      <div class="speaker user-rtc-${userRtcUid}" id="${members[i]}">
          <div>${name}</div>
      </div>`;
      document
        .getElementById("members")
        .insertAdjacentHTML("beforeend", newMember);
    }
  };

  //audio handling for joining user (rtc)
  const handleUserPublished = async (user, mediaType) => {
    //subscribe client-user
    await rtcClient.subscribe(user, mediaType);
    //check if correct mediaType
    if (mediaType === "audio") {
      remoteAudioTracks[user.uid] = [user.audioTrack]; //add audioTrack
      user.audioTrack.play();
    }
  };

  //delete user's audioTrack if they leaves (rtc)
  const handleUserLeft = async (user) => {
    //remove audiotrack of the user
    delete remoteAudioTracks[user.uid];
  };

  //handle a user joining (rtm)
  const handleMemberJoined = async (MemberId) => {
    let { name, userRtcUid } = await rtmClient.getUserAttributesByKeys(
      MemberId,
      ["name", "userRtcUid"]
    );

    let newMember = `
      <div class="speaker user-rtc-${userRtcUid}" id="${MemberId}">
          <div>${name}</div>
      </div>`;

    document
      .getElementById("members")
      .insertAdjacentHTML("beforeend", newMember);
  };

  //handle a user leaving (rtm)
  const handleMemberLeft = async (MemberId) => {
    document.getElementById(MemberId).remove();
  };

  //use Params for teamId
  const { teamId } = useParams();
  const userToken = localStorage.getItem("token");
  setIds();
  const [tasks, setTasks] = useState([]);
  let micMuted = false;
  let [buttonText, setButtonText] = useState("Mute");

  useEffect(() => {
    const fetchUserTasks = async () => {
      try {
        const response = await api.get(`/api/v1/teams/${teamId}/tasks`, {
          headers: {
            Authorization: `${userToken}`,
          },
        });
        let inSessionTasks = response.data.filter(
          (task) => task.status === "IN_SESSION"
        );
        console.log(inSessionTasks);
        setTasks([{ title: "main", taskId: "XX" }, ...inSessionTasks]);
      } catch (error) {
        setErrorGetTasks(
          "Error while creating channels. Please try again later"
        );
        console.error(`Error fetching teams tasks: ${handleError(error)}`);
      }
    };

    fetchUserTasks();

    const enterRoom = async (e) => {
      e.preventDefault();
      console.log("ABC", e.submitter.dataset.taskid);
      const taskid = e.submitter.dataset.taskid;
      //setRoomName(e.submitter.value.toLowerCase());
      roomName = e.submitter.value;
      roomName = roomName.toLowerCase();

      let userName = "";
      //get the userName
      try {
        const response = await api.get(`/api/v1/users/${userId}`, {
          headers: {
            Authorization: `${userToken}`,
          },
        });
        userName = response.data.username;
      } catch (error) {
        setErrorUserName(
          "An unexpected error occured. Please try to logout and login again"
        );
        console.error(`Error fetching user info: ${handleError(error)}`);
      }
      if (userName) {
        setIsLoading(true);
        try {
          //initalize rtc and rtm with the userName
          await initRTC(taskid);
          await initRTM(userName, taskid);

          //hide the channels
          ChannelList.style.display = "none";
          //show the voice room controls
          document.getElementById("room-header").style.display = "flex";
          //display the room-name
          document.getElementById("room-name").innerHTML = roomName;
          //leave the channel if windows is closed
          window.addEventListener("beforeunload", leaveRoom);
          //leave the channel if back to teams button is clicked
          document
            .getElementById("back-button")
            .addEventListener("click", leaveRoom);
        } catch (error) {
          setErrorGeneral(
            "An unexpected error occured. Please try to logout and login again"
          );
        }
        setIsLoading(false);
      }
    };

    const leaveRoom = async () => {
      localAudioTrack.stop();
      localAudioTrack.close();

      //leave client
      rtcClient.unpublish();
      rtcClient.leave();

      //also leave via rtm
      leaveRtmChannel();

      //display channels
      document.getElementById("form").style.display = "block";
      //remove channel control buttons
      document.getElementById("room-header").style.display = "none";
      //remove the room name
      document.getElementById("room-name").innerHTML = "";
      //empty members
      document.getElementById("members").innerHTML = "";
      //remove eventListener to avoid error on closing component
      window.removeEventListener("beforeunload", leaveRoom);
      document
        .getElementById("back-button")
        .removeEventListener("click", leaveRoom);
    };

    //leave rtm Client
    let leaveRtmChannel = async () => {
      await channel.leave();
      await rtmClient.logout();
    };

    const toggleMic = async () => {
      micMuted = !micMuted;
      setButtonText(micMuted ? "Unmute" : "Mute");
      localAudioTrack.setMuted(micMuted);
    };

    //just shortcuts
    const ChannelList = document.getElementById("form");
    const leaveButton = document.getElementById("leave-button");
    const muteButton = document.getElementById("mute-button");

    //add EventListener
    ChannelList.addEventListener("submit", enterRoom);
    leaveButton.addEventListener("click", leaveRoom);
    muteButton.addEventListener("click", toggleMic);
  }, [teamId]);

  useEffect(() => {
    const initChannels = async () => {
      tasks.map((breakoutRoom) => {
        let newChannel = `<input class="channel" name="roomname" type="submit" value="${breakoutRoom.title}" data-taskid="${breakoutRoom.taskId}" />`;
        document
          .getElementById("channels")
          .insertAdjacentHTML("beforeend", newChannel);
      });
    };

    initChannels();
  }, [tasks]);

  return (
    <BaseContainer className="base-container">
      <div id="room-header" className="room-header">
        <div id="room-header-controls" className="room-header-controls">
          <h1 className="room-name" id="room-name"></h1>
          <Button id="leave-button" className="leave-button">
            Leave
          </Button>
          <Button className="mute-button" id="mute-button">
            {buttonText}
          </Button>
        </div>
      </div>
      <form id="form">
        <div className="rooms" id="channels"></div>
        {errorUserName && <div>{errorUserName}</div>}
        {errorGetTasks && <div>{errorGetTasks}</div>}
        {errorGeneral && <div>{errorGeneral}</div>}
      </form>
      <div className="members" id="members"></div>
      {isLoading && <Spinner />}
    </BaseContainer>
  );
}

export default VoiceChat;
