import React, { useState, useEffect } from "react";
import "../../styles/ui/VoiceChat.scss";
import { useParams } from "react-router-dom";
import { api, handleError } from "helpers/api";
import { useNotification } from "../popups/NotificationContext";

import AgoraRTC from "agora-rtc-sdk-ng"; //RTC for voice transmitting
import AgoraRTM from "agora-rtm-sdk"; //RTM for Channels, Users, etc.
import BaseContainer from "./BaseContainer";
import { Button } from "./Button";
import { Spinner } from "./Spinner";
import IconButton from "../ui/IconButton";
import { MdMic, MdMicOff, MdPhoneDisabled } from "react-icons/md";

function VoiceChat() {
  const APP_ID = "a55e8c2816d34eda92942fa9e808e843";

  //Tokens for Security
  let rtcToken = null;
  let rtmToken = null;

  //new Notify Component
  const { notify } = useNotification();

  //IDs for identification, which we will use the userId for
  let rtcUID;
  let rtmUID;
  let userId;

  //set as different IDs for each use-case
  const setIds = async () => {
    rtcUID = parseInt(localStorage.getItem("id"));
    rtmUID = localStorage.getItem("id");
    userId = localStorage.getItem("id");
  };

  //ids for document modification/listening
  const documentId = {
    members: "members",
    roomHeader: "room-header",
    roomFooter: "room-footer",
    roomFooterMuted: "room-footer-muted",
    roomName: "room-name",
    backButton: "back-button",
    endSession: "endSession",
    form: "from",
    leaveButton: "leave-button",
    muteButton: "mute-button",
    unMuteButton: "unMute-button",
    channels: "channels",
    leaveTeam: "leave-team",
    deleteUser: "delete-user",
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

  //API call to get both tokens when user tries to join a channel
  const getTokens = async (taskid) => {
    try {
      const requestBody = JSON.stringify({
        userId: userId,
        teamId: teamId,
        channelName: taskid.toString() + roomName + teamId.toString(),
      });
      const response = await api.post("/api/v1/agora/getToken", requestBody, {
        headers: {
          Authorization: `${userToken}`,
        },
      });
      //save the response data

      rtcToken = response.data.rtcToken;
      rtmToken = response.data.rtmToken;
    } catch (error) {
      //Error via new notification component
      notify("error", "Could not join Channel. Please try again later");
      console.error(`Error with token: ${handleError(error)}`);
    }
  };

  const initRTM = async (name, taskid) => {
    //init rtm client with app ID
    rtmClient = AgoraRTM.createInstance(APP_ID);
    //login with rtmToken
    await rtmClient.login({ uid: rtmUID, token: rtmToken });

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

  //init RTC Client for voice
  const initRTC = async (taskid) => {
    AgoraRTC.setLogLevel(4);
    rtcClient = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

    //handle user join/leave
    rtcClient.on("user-published", handleUserPublished);
    rtcClient.on("user-left", handleUserLeft);

    //join with secure Token
    await rtcClient.join(
      APP_ID,
      taskid.toString() + roomName + teamId.toString(),
      rtcToken,
      rtcUID
    );

    //track and publish local audio track
    localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
    rtcClient.publish(localAudioTrack);

    //activate Active Speaker Indicator
    SpeakerIndicator();
  };

  const SpeakerIndicator = async () => {
    //set interval higher to avoid error
    AgoraRTC.setParameter("AUDIO_VOLUME_INDICATION_INTERVAL", 300);
    //enable the Indicator for the clinet
    rtcClient.enableAudioVolumeIndicator();

    //get Values of all members
    rtcClient.on("volume-indicator", (volumes) => {
      //set short interval for more accuracy
      if (AgoraRTC.getParameter("AUDIO_VOLUME_INDICATION_INTERVAL") !== 200) {
        AgoraRTC.setParameter("AUDIO_VOLUME_INDICATION_INTERVAL", 200);
      }
      //for each user decide if they speak or not and set the borderColor
      volumes.forEach((volume) => {
        let item = document.querySelector(
          `.user-rtc-${volume.uid}`
        ) as HTMLElement;
        if (item) {
          if (volume.level >= 50) {
            item.style.borderColor = "#AAFF00";
          } else if (item.style.borderColor !== "rgb(255, 0, 0)") {
            //only style if I'm not muted
            item.style.borderColor = "#FFFFFF";
          }
        }
      });
    });
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
        .getElementById(documentId.members)
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
      .getElementById(documentId.members)
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

  useEffect(() => {
    const fetchUserTasks = async () => {
      try {
        //fetch only the In_session Tasks for the VoiceChat with query
        const response = await api.get(
          `/api/v1/teams/${teamId}/tasks?status=IN_SESSION`,
          {
            headers: {
              Authorization: `${userToken}`,
            },
          }
        );
        //set the Tasks and the main Chat
        setTasks([{ title: "main", taskId: "XX" }, ...response.data]);
      } catch (error) {
        notify(
          "error",
          "Could not create channels. Please restart the session"
        );
        console.error(`Error fetching teams tasks: ${handleError(error)}`);
      }
    };

    fetchUserTasks();

    //fetch Tasks again if a Task is finished from the Session Task Board (or reactivated)
    document.addEventListener("checkBoxChange", fetchUserTasks);

    const enterRoom = async (e) => {
      e.preventDefault();
      const taskid = e.submitter.dataset.taskid;
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
        notify(
          "error",
          "An unexpected error occured. Please try to logout and login again"
        );
        console.error(`Error fetching user info: ${handleError(error)}`);
      }
      if (userName) {
        //try to get the Tokens, which will throw an error itself if not successful
        await getTokens(taskid);

        //if we did not get the Tokens successful, nothing else should happen
        if (rtcToken && rtmToken) {
          setIsLoading(true);
          try {
            //initalize rtc and rtm with the userName
            await initRTC(taskid);
            await initRTM(userName, taskid);

            //hide the channels
            ChannelList.style.display = "none";

            //show the voice room controls
            document.getElementById(documentId.roomHeader).style.display =
              "flex";
            document.getElementById(documentId.roomFooter).style.display =
              "flex";
            //display the room-name
            document.getElementById(documentId.roomName).innerHTML = roomName;
            //leave the channel if windows is closed
            window.addEventListener("beforeunload", leaveRoom);
            window.addEventListener("popstate", leaveRoom);
            //leave the channel if back to teams button is clicked
            document
              .getElementById(documentId.backButton)
              .addEventListener("click", leaveRoom);

            //leave the Voicechat if the session ends or if the user leaves the Team
            document.addEventListener(documentId.endSession, leaveRoom);
            document.addEventListener(documentId.leaveTeam, leaveRoom);
            //leave the Voicechat if user is deleted, logs out or starts tutorial
            document.addEventListener(documentId.deleteUser, leaveRoom);
          } catch (error) {
            notify(
              "error",
              "An unexpected error occured. Please try to logout and login again"
            );
          }
          setIsLoading(false);
        }
        rtcToken = null;
        rtmToken = null;
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

      try {
        //display channels
        document.getElementById(documentId.form).style.display = "block";
        //remove channel control buttons
        document.getElementById(documentId.roomHeader).style.display = "none";
        document.getElementById(documentId.roomFooter).style.display = "none";
        document.getElementById(documentId.roomFooterMuted).style.display =
          "none";
        //remove the room name
        document.getElementById(documentId.roomName).innerHTML = "";
        //empty members
        document.getElementById(documentId.members).innerHTML = "";
        //remove eventListener to avoid error on closing component
        window.removeEventListener("beforeunload", leaveRoom);
        window.removeEventListener("popstate", leaveRoom);
        document
          .getElementById(documentId.backButton)
          .removeEventListener("click", leaveRoom);

        document.removeEventListener(documentId.endSession, leaveRoom);
        document.removeEventListener(documentId.leaveTeam, leaveRoom);
        document.removeEventListener(documentId.deleteUser, leaveRoom);
      } catch (error) {
        //need to catch the Error of Loading a new page, in that case we dont change any styling
        window.removeEventListener("beforeunload", leaveRoom);
        window.removeEventListener("popstate", leaveRoom);

        document.removeEventListener(documentId.endSession, leaveRoom);
        document.removeEventListener(documentId.leaveTeam, leaveRoom);
        document.removeEventListener(documentId.deleteUser, leaveRoom);
      }
    };

    //leave rtm Client
    let leaveRtmChannel = async () => {
      await channel.leave();
      await rtmClient.logout();
    };

    const toggleMic = async () => {
      micMuted = !micMuted;
      localAudioTrack.setMuted(micMuted);
      if (micMuted) {
        document.getElementById(documentId.roomFooter).style.display = "none";
        document.getElementById(documentId.roomFooterMuted).style.display =
          "flex";
        let item = document.querySelector(`.user-rtc-${rtmUID}`) as HTMLElement;
        if (item) {
          item.style.borderColor = "#FF0000";
        }
      } else {
        document.getElementById(documentId.roomFooter).style.display = "flex";
        document.getElementById(documentId.roomFooterMuted).style.display =
          "none";
        let item = document.querySelector(`.user-rtc-${rtmUID}`) as HTMLElement;
        if (item) {
          item.style.borderColor = "#FFFFFF";
        }
      }
    };

    //just shortcuts
    const ChannelList = document.getElementById(documentId.form);
    const leaveButton = document.getElementById(documentId.leaveButton);
    const muteButton = document.getElementById(documentId.muteButton);
    const unMuteButton = document.getElementById(documentId.unMuteButton);

    //add EventListener
    ChannelList.addEventListener("submit", enterRoom);
    leaveButton.addEventListener("click", leaveRoom);
    muteButton.addEventListener("click", toggleMic);
    unMuteButton.addEventListener("click", toggleMic);
  }, [teamId]);

  useEffect(() => {
    const initChannels = async () => {
      document.getElementById(documentId.channels).innerHTML = "";
      tasks.map((breakoutRoom) => {
        let newChannel = `<input title="Click to join the channel" class="channel" name="roomname" type="submit" value="${breakoutRoom.title}" data-taskid="${breakoutRoom.taskId}" />`;
        document
          .getElementById(documentId.channels)
          .insertAdjacentHTML("beforeend", newChannel);
      });
    };

    initChannels();
  }, [tasks]);

  return (
    <BaseContainer className="base-container">
      <div id={documentId.roomHeader} className="room-header">
        <h1 className="room-name" id={documentId.roomName}></h1>
        <IconButton
          id={documentId.leaveButton}
          icon={MdPhoneDisabled}
          className="red-icon"
          style={{ scale: "2", marginRight: "-100%" }}
        />
        <div className="room-header-controls"></div>
      </div>
      <form id={documentId.form}>
        <div className="rooms" id={documentId.channels}></div>
      </form>
      <div className="members" id={documentId.members}></div>
      <div id={documentId.roomFooter} className="room-footer">
        <IconButton
          icon={MdMic}
          id={documentId.muteButton}
          className="green-icon"
          style={{ scale: "2.5", marginRight: "10px", marginTop: "15px" }}
        />
      </div>
      <div id={documentId.roomFooterMuted} className="room-footer">
        <div></div>
        <IconButton
          icon={MdMicOff}
          id={documentId.unMuteButton}
          className="red-icon"
          style={{ scale: "2.5", marginRight: "10px", marginTop: "15px" }}
        />
      </div>
      {isLoading && <Spinner />}
    </BaseContainer>
  );
}

export default VoiceChat;
