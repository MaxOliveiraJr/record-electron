document.addEventListener('DOMContentLoaded', () => {

    const display = document.querySelector('#display');
    const record = document.querySelector('#record');
    const micInput = document.querySelector('#mic');

    let isRecording = false;
    let selectedDeviced = null;
    let mediaRecorder = null;
    let startTime = null;
    let chucks = [];

    // Get available devices

    navigator.mediaDevices.enumerateDevices().then(devices => {
        devices.forEach(device => {
            if (device.kind === "audioinput") {
                if (!selectedDeviced) {
                    selectedDeviced = device.deviceId;
                }

                const option = document.createElement('option');
                option.value = device.deviceId;
                option.text = device.label;
                micInput.appendChild(option);
            }
        });
    })

    micInput.addEventListener('change', (event) => {
        selectedDeviced = event.target.value;
        console.log(selectedDeviced);
    })

    function updateButtonTo(recording) {
        if (recording) {
            document.querySelector('#record').classList.add('recording');
            document.querySelector('#mic-icon').classList.add('hide');
        } else {
            document.querySelector('#record').classList.remove('recording');
            document.querySelector('#mic-icon').classList.remove('hide');
        }
    }


    record.addEventListener('click', () => {
        updateButtonTo(!isRecording)

        handleRecord(isRecording)

        isRecording = !isRecording;
    })

    function handleRecord(recording) {
        if (recording) {
            mediaRecorder.stop();
        } else {



            navigator.mediaDevices.getUserMedia({
                audio: {
                    deviceId: selectedDeviced
                }, video: false
            }).then(stream => {


                mediaRecorder = new MediaRecorder(stream)
                mediaRecorder.start();
                startTime = Date.now();
                updateDisplay();
                mediaRecorder.ondataavailable = (event) => {
                    chucks.push(event.data);
                }
                mediaRecorder.onstop = (event) => {
                    saveData();
                }
            })
        }
    }

    function saveData() {
        const blob = new Blob(chucks, { "type": "audio/webm;codecs=oputs" });


        console.log(blob);
        document.querySelector('#audio').src = URL.createObjectURL(blob);
        chucks = [];
    }

    function updateDisplay() {
        display.innerHTML = durationTimestamp(Date.now() - startTime);
        if (isRecording) {
            window.requestAnimationFrame(updateDisplay);
        }
    }

    function durationTimestamp(duration) {

        let mili = parseInt((duration % 1000)/100)
        let seconds = Math.floor((duration / 1000) % 60);
        let minutes = Math.floor((duration / 1000 / 60) % 60);
        let hours = Math.floor(duration / 1000 / 60 / 60);

        seconds = seconds < 10 ? "0" + seconds : seconds;
        minutes = minutes < 10 ? "0" + minutes : minutes;
        hours = hours < 10 ? "0" + hours : hours;


        return `${hours}:${minutes}:${seconds}:${mili}`


    }


})

window.onload = () => {
    document.body.classList.remove('preload');
}