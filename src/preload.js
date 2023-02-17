// window.addEventListener('DOMContentLoaded', () => {
//     const os = require('os');
//     const processor = document.querySelector('#processor');
//     processor.innerHTML = os.cpus()[0].model;

// })
   
   
window.addEventListener('DOMContentLoaded', () => {
    const processor = document.querySelector('#processor');
    const {ipcRenderer} = require('electron');


    ipcRenderer.on('cpu_name',(e,value)=>{
        processor.innerHTML = value
    })


    function sendNwWindowMessage(){
        ipcRenderer.send("open_new_window");
    }
})