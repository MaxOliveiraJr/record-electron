document.addEventListener('DOMContentLoaded',()=>{

    const display = document.querySelector('#display');
    const record = document.querySelector('#record');
    const micInput = document.querySelector('#mic');

    let isRecording = false;
    let selectedDeviced = null;

    // Get available devices

    navigator.mediaDevices.enumerateDevices().then(devices=>{
        devices.forEach(device=>{
            if (device.kind === "audioinput"){
                if(!selectedDeviced){
                    selectedDeviced = device.deviceId;
                }

                const option = document.createElement('option');
                option.value = device.deviceId;
                option.text = device.label;
                micInput.appendChild(option);
            }
        });
    })

    micInput.addEventListener('change',(event)=>{
        selectedDeviced = event.target.value;
        console.log(selectedDeviced);
    })

   function updateButtonTo(recording){
    if(recording){
        document.querySelector('#record').classList.add('recording');
        document.querySelector('#mic-icon').classList.add('hide');
    }else{
        document.querySelector('#record').classList.remove('recording');
        document.querySelector('#mic-icon').classList.remove('hide');
    }
   }    

})

window.onload = ()=>{
    document.body.classList.remove('preload');
}