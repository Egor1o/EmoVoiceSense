import styled from "styled-components";
import { useRef, useState } from "react";
import axios from "axios";
import {
  IMediaRecorder,
  MediaRecorder,
  register,
} from "extendable-media-recorder";
import { connect } from "extendable-media-recorder-wav-encoder";

await register(await connect());

const format = "wav";

const MainScreen = () => {
  const [hasPermissions, setHasPermissions] = useState(false);
  const mediaRecorder = useRef<IMediaRecorder | null>(null);
  const [recordingStatus, setRecordingStatus] = useState("inactive");
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [emotion, setEmotion] = useState("");

  const getData = async (audioBlob: Blob) => {
    const formData = new FormData();
    formData.append("speech", audioBlob, `recording.wav`);

    try {
      const response = await axios.post<string>(
        "http://localhost:5173/api/analyze",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      setEmotion(response.data);
    } catch (e) {
      console.log("error");
    }
  };

  const getMicrophonePermission = async () => {
    if ("MediaRecorder" in window) {
      try {
        const streamData = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        setHasPermissions(true);
        setStream(streamData);
      } catch (err) {
        if (err instanceof Error) {
          alert(err.message);
        }
      }
    } else {
      alert("The MediaRecorder API is not supported in your browser.");
    }
  };

  const startRecording = async () => {
    setRecordingStatus("recording");
    if (stream) {
      const media = new MediaRecorder(stream, { mimeType: "audio/wav" });
      //set the MediaRecorder instance to the mediaRecorder ref
      mediaRecorder.current = media;
      //invokes the start method to start the recording process
      mediaRecorder.current.start();
      const localAudioChunks: Blob[] = [];
      mediaRecorder.current.ondataavailable = (event) => {
        if (typeof event.data === "undefined") return;
        if (event.data.size === 0) return;
        localAudioChunks.push(event.data);
      };
      setAudioChunks(localAudioChunks);
    }
  };

  const stopRecording = () => {
    setRecordingStatus("inactive");
    //stops the recording instance
    if (mediaRecorder.current) {
      mediaRecorder.current.stop();
      if (stream) {
        const tracks = stream.getTracks();
        tracks.forEach((track) => {
          track.stop();
        });
      }
      mediaRecorder.current.onstop = () => {
        //creates a blob file from the audiochunks data
        const audioBlob = new Blob(audioChunks, { type: `audio/${format}` });
        getData(audioBlob);
        setAudioChunks([]);
      };
    }
  };

  const goBack = () => {
    setRecordingStatus("inactive");
    setAudioChunks([]);
    setEmotion("");
  };

  return (
    <ScreenContainer>
      <h2>EmoVoiceSense</h2>
      <div>
        {emotion !== "" ? (
          <EmotionContainerDev>
            <StyledText>You are {emotion.split("\n")[0]}</StyledText>
            {emotion.split("\n")[1]}
            <button
              onClick={goBack}
              style={{
                width: "10rem",
                alignSelf: "flex-end",
                marginTop: "1rem",
              }}
            >
              Go back
            </button>
          </EmotionContainerDev>
        ) : !hasPermissions ? (
          <>
            <p>You must give permission for using your microphone first</p>
            <button onClick={getMicrophonePermission} type="button">
              Get Microphone
            </button>
          </>
        ) : recordingStatus === "inactive" ? (
          <>
            <button onClick={startRecording} type="button">
              Start Recording
            </button>
          </>
        ) : recordingStatus === "recording" ? (
          <>
            <button onClick={stopRecording} type="button">
              Stop Recording
            </button>
          </>
        ) : null}
      </div>
    </ScreenContainer>
  );
};
/*
* {audio !== "" ? (
          <div className="audio-container">
            <audio src={audio} controls></audio>
            <a download href={audio}>
              Download Recording
            </a>
          </div>
        ) : null}
*
* */
const ScreenContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const StyledText = styled.p`
  font-size: 24px;
  font-weight: bold;
`;

const EmotionContainerDev = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  background-color: rgba(0, 249, 255, 0.41);
  padding: 2rem;
  border-radius: 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

export default MainScreen;
