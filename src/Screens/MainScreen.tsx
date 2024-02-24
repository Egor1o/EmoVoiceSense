import styled from "styled-components";
import { useRef, useState } from "react";

const MainScreen = () => {
  const [hasPermissions, setHasPermissions] = useState(false);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const [recordingStatus, setRecordingStatus] = useState("inactive");
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [audio, setAudio] = useState("");

  const getMicrophonePermission = async () => {
    if ("MediaRecorder" in window) {
      try {
        const streamData = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: false,
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
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      const media = new MediaRecorder(stream, { type: "audio/wav" });
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
      mediaRecorder.current.onstop = () => {
        //creates a blob file from the audiochunks data
        const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
        //creates a playable URL from the blob file.
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudio(audioUrl);
        setAudioChunks([]);
      };
    }
  };

  return (
    <ScreenContainer>
      <h2>Audio Recorder</h2>
      <div>
        {!hasPermissions ? (
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
        {audio !== "" ? (
          <div className="audio-container">
            <audio src={audio} controls></audio>
            <a download href={audio}>
              Download Recording
            </a>
          </div>
        ) : null}
      </div>
    </ScreenContainer>
  );
};

const ScreenContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: center;
  align-items: center;
`;

export default MainScreen;
