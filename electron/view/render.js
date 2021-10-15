// const { ipcRenderer } = require('electron');

// window.onload = () => {
// 	const h1 = document.querySelector("h1")
// 	ipcRenderer.on("error", (e)=>{
// 		h1.innerHTML = "Error checking for updates: app quitting.";
// 	})
// 	ipcRenderer.on("prog", (e)=>{
// 		h1.innerHTML = e;
// 	})
// 	ipcRenderer.on("checking", (e)=>{
// 		h1.innerHTML = "Checking for updates...";
// 	})
// }