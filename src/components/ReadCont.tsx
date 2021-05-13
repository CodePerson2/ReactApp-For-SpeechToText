import React from "react";
import ReactDOM from "react-dom";
import { useState } from "react/";
import { BsStopFill, BsFillSkipStartFill, BsFillMicFill, BsFillHouseFill } from "react-icons/bs";
import {
  sendAudio,
  recieve,
  restartApp,
  phrases,
} from "./scripting/request";
import Phrases from "./Phrases";

declare var MediaRecorder: any;
declare var Blob: any;

const ReadCont = ({startTransition}: any) => {
  const [mediaRec, setMediaRec] = useState({ state: null });
  const [currentlyRecording, setCurrentlyRecording] = useState(false);


  const checkAudioPermission = () => {
    if(mediaRec.state === 'recording') return;

    if (navigator.mediaDevices) {
      var media = navigator.mediaDevices.getUserMedia({ audio: true });
      media.then((stream) => {
        startRecording(stream);
        setCurrentlyRecording(true);
      });
      media.catch((err) => {
        console.log("Media Error: " + err);
      });
    } else {
      console.log("getUserMedia not supported on browser");
    }
  };


  const startRecording = (stream: object) => {
    var mediaRecorder: any = new MediaRecorder(stream);
    var chunks: any = [];
    setMediaRec(mediaRecorder);

    //begin awaiting io response
    recieve().then((ph: any) => {
    });

    mediaRecorder.ondataavailable = function (e: any) {
      chunks.push(e.data);

      var blob: any;

      blob = new Blob(chunks, {
        type: "audio/mp3",
      });
      if (blob.size > 0) sendAudio(blob);

      //send file to server
    };
    mediaRecorder.start(1500);

    mediaTimer(mediaRecorder);
  };

  const mediaTimer = (mediaRecorder: any) => {
    var t = setTimeout(() => {
      if (mediaRecorder && mediaRecorder.state === "inactive") {
        return;
      } else {
        checkAudioPermission();
        setTimeout(() => {
          mediaRecorder.stop();
        }, 1000);
      }
    }, 3000);
  };

  const stopRecording = (mediaRecorder: any) => {
    if (mediaRecorder && mediaRecorder.state === "recording") {
      mediaRecorder.stop();
      setCurrentlyRecording(false);
    }
  };

  const restartSpeech = (mediaRecorder: any) => {
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
