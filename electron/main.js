// Requires
const { app, BrowserWindow, Tray, Menu, Notification, ipcMain, ipcRenderer } = require('electron');
const Koa = require('koa');
const cors = require('@koa/cors');
const koaBody = require('koa-body');
const Router = require('koa-router');
const RPC = require('discord-rpc');
const {autoUpdater} = require("electron-updater");

// Vars
let updaterWindow;

const clientId = '891607135769739285';

const client = new RPC.Client({ transport: 'ipc' });

client.on('ready', () => {
  // console.log('Authed for user', client.user.username);
});

// Log in to RPC with client id
client.login({ clientId });



const changeStatus = (status) => {
	// console.log("[OK]", status.now, status.enabled)
	if (status.enabled && status.now !== {}) {
		if (!status.now.fileName) {
			return client.clearActivity();
		}
		const private = (status.now.private || true) ? '(private)' : '';
		const fileName = status.now.fileName || "a file";
		const name = status.privacy ? 'a hidden repl' : (status.now.name || 'No repl defined');
		const author = status.privacy ? 'hidden user' : (status.now.user || 'No user defined');
		const link = status.privacy ? 0 : `${(status.now.name || 'null')}.${(status.now.user || 'null')}.repl.co`;
		client.setActivity({
			details: `Editing ${fileName}`,
			state: `Working on ${name}`,
			largeImageKey: 'replit',
			largeImageText: `Logged in as ${author}`,
		})
	} else {
		// remove
		client.clearActivity();
	}
}

const router = new Router({
	prefix: '/'
});
const koa = new Koa();

let tray;

let config = {
	privacy: false,
	enabled: true,
	now: {},
	lastSent: 0
}

setTimeout(()=>{
	const now = Math.round(new Date().getTime()/1000);
	if (config.lastSent+15 < now) {
		config.now = {};
	}
	changeStatus();
}, 15000)

// Electron
app.whenReady().then(() => {
	/*  ELECTRON UPDATER */
	//autoUpdater.updateConfigPath = __dirname+'/app-update.yml';
	//autoUpdater.checkForUpdates();
	/*  ELECTRON UPDATER */
  	new Notification({ title:'Replit RPC', body: 'Replit RPC is now running and minimized to tray.' }).show()
	tray = new Tray(__dirname + '/icons/48.png');
	const contextMenu = Menu.buildFromTemplate([
		{ label: 'Replit RPC', enabled: false },
		{ label: 'Enabled', type: 'checkbox', 
		click: (e) => { config.enabled = e.checked; changeStatus(config.now); }, 
		checked: config.enabled },
		{ label: 'Privacy', type: 'checkbox', 
		click: (e) => { config.privacy = e.checked; changeStatus(config.now); }, 
		checked: config.privacy },
		{ label: 'Exit', type: 'normal',
		click: () => { app.quit(); process.exit() } },
	])
	tray.setToolTip('Replit Discord RPC');
	tray.setContextMenu(contextMenu)
})


// Koa
koa.use(cors());
koa.use(koaBody());
koa.listen(51337);
router.post('/', (ctx, next) => {
	config.now = ctx.request.body;
	config.lastSent = Math.round(new Date().getTime()/1000);
	// console.log(config)
	changeStatus(config);
	next();
});

router.get('/png', (ctx, next) => {
	ctx.body = "pong"
	next();
});

koa.use(router.routes());
;
/*  ELECTRON UPDATER */
// autoUpdater.on('checking-for-update', () => {
// 	updaterWindow = new BrowserWindow({
// 		width: 400,
// 		height: 400,
// 		frame: false,
// 		closable: false,
// 		minimizable: false,
// 		resizable: false,
// 		alwaysOnTop: true,
// 		roundedCorners: true,
// 		webPreferences: {
// 			nodeIntegration: false,
// 			contextIsolation: true,
// 			enableRemoteModule: false,
// 			preload: app.getAppPath()+'/view/render.js'
// 		}
// 	});
// 	updaterWindow.loadFile("view/update.html");
// 	updaterWindow.webContents.send("checking", "");
// })
// autoUpdater.on('update-available', (info) => {
// })
// autoUpdater.on('update-not-available', (info) => {
// 	updaterWindow.destroy();
// 	updaterWindow = null;
// })
// autoUpdater.on('error', (err) => {
// 	updaterWindow.webContents.send("error", err);
// 	setTimeout(()=>{
// 		app.quit();
// 	}, 5000)
// })
// autoUpdater.on('download-progress', (progressObj) => {
// 	updaterWindow.webContents.send("prog", progressObj);
// })
// autoUpdater.on('update-downloaded', (info) => {
//   autoUpdater.quitAndInstall();
// })
/*  ELECTRON UPDATER */