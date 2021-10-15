;(function() {
	function inject() {
		const script = document.createElement('script')
		script.text = "";
		script.text += `const oldURLsGetFileName = () => { if (window.location.href.split("#").length === 1) { return false }; let data = window.location.href.split("#"); data = data[data.length-1].split("?")[0]; data=data.split("/"); if(data.length === 1) {return data[0]}; data=data[data.length-1];  return data; };`
		script.text += `const oldURLsync = () => { var url = "http://localhost:51337";a=__REPLIT_REDUX_STORE__.getState();b=a['replEnvironment']['activeReplId'];var xhr = new XMLHttpRequest();xhr.open("POST", url);xhr.setRequestHeader("Content-Type", "application/json");var data = { name: a['repls']['data'][b]['title'], private: a['repls']['data'][b]['isPrivate'], user: a['user']['userInfo']['username'], fileName: oldURLsGetFileName() }; xhr.send(JSON.stringify(data)); };`;
		script.text += `let oldURL = window.location.href; setInterval(()=>{oldURLsync();}, 7500); window.onload = oldURLsync`;
		document.documentElement.appendChild(script)
	}
	inject();
})()