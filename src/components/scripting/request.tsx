declare var io: any;
var socket = io.connect('/');

socket.on('audioText', (data: Array<any>) => {
    console.log(data);
})
export const sendAudio = (audio: any) =>{

    socket.emit('audio', {
        file: audio
    });

}
