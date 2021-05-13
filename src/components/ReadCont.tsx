import { useState } from "react/";
import { BsStopFill, BsFillSkipStartFill, BsFillMicFill, BsFillHouseFill } from "react-icons/bs";
import {
  sendAudio,
  recieve,
  restartApp,
  phrases,
} from "./scripting/request";
import Phrases from "./Phrases";

// declares Javascript Objects
declare var MediaRecorder: any;
declare var Blob: any;

const ReadCont = ({startTransition}: any) => {

  // MediaRecorder stored in state
  const [mediaRec, setMediaRec] = useState({ state: null });

  // status of recording
  const [currentlyRecording, setCurrentlyRecording] = useState(false);

  // checks audio permissions and then begins recording
  const checkAudioPermission = () => {
    if(mediaRec.state === 'recording') return;

    if (navigator.mediaDevices) {
      var media = navigator.mediaDevices.getUserMedia({ audio: true });

      // if Okay to record, begin recording
      media.then((stream) => {
        startRecording(stream);
        setCurrentlyRecording(true);
      });

      // console out error
      media.catch((err) => {
        console.log("Media Error: " + err);
      });
    } else {
      console.log("getUserMedia not supported on browser");
    }
  };

  // called if mediaRecorder is okay to record
  const startRecording = (stream: object) => {
    var mediaRecorder: any = new MediaRecorder(stream);
    var chunks: any = [];
    setMediaRec(mediaRecorder);

    //begin awaiting io response
    recieve().then((ph: any) => {
    });

    // recieves chunks of data every 1.5 seconds 
    // sends audio to server if blob is > 0
    const receiverTime: number = 1500;
    mediaRecorder.ondataavailable = function (e: any) {
      chunks.push(e.data);

      var blob: any;

      // Audio Blob to mp3 blob
      blob = new Blob(chunks, {
        type: "audio/mp3",
      });
      if (blob.size > 0) sendAudio(blob);

      //send file to server
    };
    mediaRecorder.start(receiverTime);

    // Timer
    mediaTimer(mediaRecorder);
  };

  // Timer initializes timeout for mediaRecorder to complete audio recording
  // when new mediaRecorder is being created
  // turn-around time is 3 seconds
  const mediaTimer = (mediaRecorder: any) => {
    var t = setTimeout(() => {
      if (mediaRecorder && mediaRecorder.state === "inactive") {
        return;
      } else {
        checkAudioPermission();

        // stop mediaRecorder 1 second after new mediaRecorder is created
        setTimeout(() => {
          mediaRecorder.stop();
        }, 1000);
      }
    }, 3000);
  };

  // Stops recording media if conditions are met
  const stopRecording = (mediaRecorder: any) => {
    if (mediaRecorder && mediaRecorder.state === "recording") {
      mediaRecorder.stop();
      setCurrentlyRecording(false);
    }
  };

  // When user clicks <-- back button to restart speech to text paragraph
  const restartSpeech = (mediaRecorder: any) => {

    // resets values in request.tsx file
    stopRecording(mediaRec);

    setMediaRec({ state: null });
    restartApp();

  };


  return (
    <div>
      <div className="home" onClick={() => {startTransition("Selection")}}>
        <BsFillHouseFill className="home-icon"/>
      </div>
      <div className="readCont">
        <div className="readBox" id="readBox">
        <Phrases phrase={phrases} />
        </div>
        <div className="buttonCont">
          <div
            className={`playButton  ${currentlyRecording ? "recording" : ""}`}
            onClick={() => checkAudioPermission()}
          >
            <BsFillMicFill className={"playButton-icon"} />
          </div>
          <div className="stopButton" onClick={() => stopRecording(mediaRec)}>
            <BsStopFill className="stopButton-icon" />
          </div>
          <div
            className="restartButton"
            onClick={() => restartSpeech(mediaRec)}
          >
            <BsFillSkipStartFill className="restartButton-icon" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReadCont;
