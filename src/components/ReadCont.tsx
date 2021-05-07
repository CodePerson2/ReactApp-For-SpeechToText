import React from "react";
import ReactDOM from 'react-dom'
import { useState } from "react/";
import { BsFillPlayFill, BsStopFill } from "react-icons/bs";
import { sendAudio, recieve, recieveOff, phrases } from "./scripting/request";
import Phrases from './Phrases';

declare var MediaRecorder: any;
declare var Blob: any;


const ReadCont = () => {
  const [mediaRec, setMediaRec] = useState({ state: null });
  const [apiWords, setApiWords] = useState([]);
  const [text, setText] = useState(phrases);

  
  const checkAudioPermission = () => {
    if (navigator.mediaDevices) {
      var media = navigator.mediaDevices.getUserMedia({ audio: true });
      media.then((stream) => {
        startRecording(stream);
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
    recieve()
    .then((ph: any) => {
      setText(ph);
      ReactDOM.render(<Phrases phrase={ph}/>, document.getElementById("readBox"));
    })

    mediaRecorder.ondataavailable = function (e: any) {
      chunks.push(e.data);

      var blob: any = new Blob(chunks, {
        type: "audio/mp3",
      });

      //send file to server
      sendAudio(blob);
      //console.log(blob);
    };
    mediaRecorder.start(1500);

    var t = setTimeout(() => {
        if (mediaRecorder && mediaRecorder.state === "inactive") {
            return;
        }
        else{
            mediaRecorder.stop();
            checkAudioPermission();
        }

    }, 9000);
  };

  const stopRecording = (mediaRecorder: any) => {
    if (mediaRecorder && mediaRecorder.state === "recording") {
      mediaRecorder.stop();
    } else {
      console.log("Not Recording!");
    }
  };

  return (
    <div className="readCont">
      <div className="readBox" id="readBox">
          <Phrases phrase={text}/>
      </div>
      <div className="buttonCont">
        <div className="playButton" onClick={() => checkAudioPermission()}>
          <BsFillPlayFill className="playButton-icon" />
        </div>
        <div className="stopButton" onClick={() => stopRecording(mediaRec)}>
          <BsStopFill className="stopButton-icon" />
        </div>
      </div>
    </div>
  );
};

export default ReadCont;
