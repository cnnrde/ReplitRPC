const action = (callback) => {
	if(document.readyState === 'interactive') {
        callback();
    } else {
		document.addEventListener("DOMContentLoaded", ()=>{
			callback();
		})
	}
}

const { ipcRenderer } = require('electron');
ipcRenderer.on("prog", (e)=>{
	action(()=>{

	});
	h2.innerHTML = e;
})
ipcRenderer.on("checking", (e)=>{
	action(()=>{
		h2.innerHTML = "Checking for updates...";
	});
})
ipcRenderer.on("error", (e)=>{
	action(()=>{
		document.querySelector("h2").innerHTML = "Error";
		document.querySelector("#con").innerHTML = "Failed to connect to the update server";
		document.querySelector(".logo").classList.remove("spinner")
	});
})
ipcRenderer.on("restart", ()=>{
	action(()=>{
		document.querySelector("h2").innerHTML = "Restarting";
		document.querySelector("#con").innerHTML = "Restarting to install update.";
	});
})