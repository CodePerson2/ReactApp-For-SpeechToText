import React from 'react'
import {useState} from 'react/'
import {BsFillPlayFill, BsStopFill} from 'react-icons/bs'
import {sendAudio} from './scripting/request'

declare var MediaRecorder: any;
declare var Blob: any;

const ReadCont = () => {

    const [mediaRecorder, setMediaRecorder] = useState({state: null});
    const [audioSamp, setAudioSamp] = useState(Array);


    const checkAudioPermission = () => {
        if (navigator.mediaDevices) {
            var media = navigator.mediaDevices.getUserMedia({audio: true});
            media.then((stream) => {
                startRecording(stream);
            });
            media.catch((err) => {
                console.log("Media Error: " + err );
            });

        }else{
            console.log("getUserMedia not supported on browser");
        }
    }

    const startRecording = (stream: object) => {
       
        const mediaRecorder: any = new MediaRecorder(stream);
        setMediaRecorder(mediaRecorder);

        console.log(audioSamp);
        mediaRecorder.ondataavailable = function(e: any) {
            //setAudioSamp(audioSamp.push(e.data));
            

            //plays audio snippet
            const audio: any = document.getElementById("aud");
            audio.setAttribute('controls', '');
            var blob: any = new Blob([e.data], { 
                'type': 'audio/mp3' 
              });
            // var audioURL = window.URL.createObjectURL(blob);
            // audio.src = audioURL;
            console.log(blob)
            localStorage.myfile = blob;
            sendAudio(blob);
        }

        mediaRecorder.start(1000);
        console.log(mediaRecorder.state);

    }

    const stopRecording = (mediaRecorder: any) => {
        if(mediaRecorder && mediaRecorder.state === "recording"){
            mediaRecorder.stop();
        }
        else{
            console.log("Not Recording!");
        }
        
    }
    return (
        <div className="readCont">
            <div className="readBox">

            </div>
            <div className="buttonCont">
                <div className="playButton" onClick={() => checkAudioPermission()}>
                    <BsFillPlayFill className="playButton-icon"/>
                </div>
                <div className="stopButton" onClick={() => stopRecording(mediaRecorder)}>
                    <BsStopFill className="stopButton-icon"/>
                </div>
            </div>
            <audio id="aud"/>
            
        </div>
    )
}

export default ReadCont
