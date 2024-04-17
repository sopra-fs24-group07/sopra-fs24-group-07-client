import React, { useState } from "react";
import "../../styles/ui/VoiceChat.scss";

import AgoraRTC from "agora-rtc-sdk-ng"; //RTC for voice transmitting
import AgoraRTM from "agora-rtm-sdk"; //RTM for Channels, Users, etc.

const VoiceChat = () => {
  //use Params for teamId
  //localStorage for token
  //localStorage for userId

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

  return <div>VoiceChat</div>;
};

export default VoiceChat;
