declare var io: any;
var socket = io.connect('/');
export const sendAudio = (audio: any) =>{

    socket.emit('audio', {
        file: audio
    });

}
