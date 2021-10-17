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
		document.querySelector("h2").innerHTML = "Downloading update";
	});
})
ipcRenderer.on("checking", (e)=>{
	action(()=>{
		document.querySelector("h2").innerHTML = "Checking for updates...";
		document.querySelector("#con").innerHTML = "<h4>Please wait...</h4>";
	});
})
ipcRenderer.on("error", (e)=>{
	action(()=>{
		document.querySelector("h2").innerHTML = "Error";
		document.querySelector("#con").innerHTML = "<h4>Update failed.</h4>";
		document.querySelector(".logo").classList.remove("spinner")
	});
})
ipcRenderer.on("restart", ()=>{
	action(()=>{
		document.querySelector("h2").innerHTML = "Restarting";
		document.querySelector("#con").innerHTML = "<h4>Restarting to install update.</h4>";
	});
})
ipcRenderer.on("Update", ()=>{
	action(()=>{
		document.querySelector("h2").innerHTML = "Updating";
		document.querySelector("#con").innerHTML = "<h4>An update was found, updating now.</h4>";
	});
})
ipcRenderer.on("noUpdate", ()=>{
	action(()=>{
		document.querySelector("h2").innerHTML = "Starting";
		document.querySelector("#con").innerHTML = "<h4>Please wait.</h4>";
	});
})