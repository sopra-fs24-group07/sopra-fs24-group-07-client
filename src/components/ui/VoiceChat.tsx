import React, { useState, useEffect } from "react";
import "../../styles/ui/VoiceChat.scss";
import { useParams } from "react-router-dom";

import AgoraRTC from "agora-rtc-sdk-ng"; //RTC for voice transmitting
import AgoraRTM from "agora-rtm-sdk"; //RTM for Channels, Users, etc.

const VoiceChat = () => {
  //use Params for teamId
  const { teamId } = useParams();
  //localStorage for token
  const userToken = localStorage.getItem("token");
  //localStorage for userId
  const userId = localStorage.getItem("id");

  const APP_ID = "a55e8c2816d34eda92942fa9e808e843";
  const TOKEN = null;

  //IDs for identification, which we will use the userId for
  const [rtcUID, setRtcUID] = useState();
  const [rtmUID, setRtmUID] = useState(); // .toString()

  //all the tasks, from which we will get our channels
  const [tasks, setTasks] = useState([]);

  //the name of the room (a single task in our case)
  const [roomName, setRoomName] = useState("");

  //the published channel, we use teamId + roomName to make individual channels
  const [channel, setChannel] = useState("");

  //local AudioTrack for myself and remoteAudioTracks of the others
  const [localAudioTrack, setLocalAudioTrack] = useState(null);
  const [remoteAudioTracks, setRemoteAudioTracks] = useState({});

  //the Clients, which will be initialized later
  const [rtcClient, setRtcClient] = useState(null);
  const [rtmClient, setRtmClient] = useState(null);

  //API Call to get all Tasks, then filter for those IN_SESSION

  //API Call to get my own Username

  const initRTM = async (uName) => {
    //init rtm client with app ID
    setRtmClient(AgoraRTM.createInstance(APP_ID));
    await rtmClient.login({ uid: rtmUID, token: TOKEN });

    //add user to local attribute
    rtmClient.addOrUpdateLocalUserAttribute({
      uName: uName,
      userRtcUid: rtcUID.toString(),
    });

    //create the channel with roomName, teamId and them join
    //TODO: can i concatinate it like that?
    setChannel(teamId.toString() + roomName);
    await channel.join();

    // get the members that are in a channel
    getChannelMembers();

    //what happens if a user joins/leaves
    channel.on("MemberJoined", handleMemberJoined);
    channel.on("MemberLeft", handleMemberLeft);
  };

  const initRTC = async () => {
    setRtcClient(AgoraRTC.createClient({ mode: "rtc", codec: "vp8" }));

    //handle user join/leave
    rtcClient.on("user-published", handleUserPublished);
    rtcClient.on("user-left", handleUserLeft);

    //TODO: does this work with channel instead of roomName
    await rtcClient.join(APP_ID, teamId.toString() + roomName, TOKEN, rtcUID);

    //track and publish local audio track
    setLocalAudioTrack(await AgoraRTC.createMicrophoneAudioTrack());
    rtcClient.publish(localAudioTrack);
  };

  //TODO: is const ok or do i need let?
  const getChannelMembers = async () => {
    let members = await channel.getMembers();

    for (let i = 0; members.length > i; i++) {
      let { uName, userRtcUid } = await rtmClient.getUserAttributesByKeys(
        members[i],
        ["name", "userRtcUid"]
      );

      //TODO: className in scss
      let newMember = `
      <div className="speaker user-rtc-${userRtcUid}" id="${members[i]}">
          <p>${uName}</p>
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
      setRemoteAudioTracks((prevState) => ({
        ...prevState,
        [user.uid]: [user.audioTrack],
      }));
      user.audioTrack.play();
    }
  };

  //delete user's audioTrack if they leaves (rtc)
  const handleUserLeft = async (user) => {
    //remove audiotrack of the user
    setRemoteAudioTracks((prevState) => {
      const newState = { ...prevState };
      delete newState[user.uid];
      return newState;
    });
  };

  //handle a user joining (rtm)
  const handleMemberJoined = async (MemberId) => {
    let { uName, userRtcUid } = await rtmClient.getUserAttributesByKeys(
      MemberId,
      ["name", "userRtcUid"]
    );
    //TODO: add scss
    let newMember = `
      <div className="speaker user-rtc-${userRtcUid}" id="${MemberId}">
          <p>${uName}</p>
      </div>`;

    document
      .getElementById("members")
      .insertAdjacentHTML("beforeend", newMember);
  };

  //handle a user leaving (rtm)
  const handleMemberLeft = async (MemberId) => {
    document.getElementById(MemberId).remove();
  };

  useEffect(() => {
    const initChannels = async () => {
      tasks.map((breakoutRoom) => {
        let newChannel = `<input className="rooms" name="roomname" type="submit" value="${breakoutRoom}" />`;
        document
          .getElementById("channels")
          .insertAdjacentHTML("beforeend", newChannel);
      });
    };

    const enterRoom = async (e) => {
      e.preventDefault();
      setRoomName(e.submitter.value.toLowerCase());

      //TODO: change this with API call
      const userName = "Monti";

      //initalize rtc and rtm with the userName
      await initRTC();
      await initRTM(userName);

      //hide the channels
      ChannelList.style.display = "none";
      //show the voice room controls
      document.getElementById("room-header").style.display = "flex";
      //display the room-name
      document.getElementById("room-name").innerHTML = roomName;
      //leave the channel if windows is closed
      window.addEventListener("beforeunload", leaveRoom);
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
    };

    //leave rtm Client
    let leaveRtmChannel = async () => {
      await channel.leave();
      await rtmClient.logout();
    };

    //just shortcuts
    const ChannelList = document.getElementById("form");
  }, []);

  return <div>VoiceChat</div>;
};

export default VoiceChat;
