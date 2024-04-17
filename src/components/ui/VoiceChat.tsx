import React, { useState } from "react";
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
      name: uName,
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
    await rtcClient.join(APP_ID, channel, TOKEN, rtcUID);

    //track and publish local audio track
    setLocalAudioTrack(await AgoraRTC.createMicrophoneAudioTrack());
    rtcClient.publish(localAudioTrack);
  };

  return <div>VoiceChat</div>;
};

export default VoiceChat;
