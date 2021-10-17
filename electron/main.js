// Requires
const {
  app,
  BrowserWindow,
  Tray,
  Menu,
  Notification,
  autoUpdater,
  shell
} = require('electron')
const Koa = require('koa')
const cors = require('@koa/cors')
const koaBody = require('koa-body')
const Router = require('koa-router')
const RPC = require('discord-rpc')

// Updater
const server = "https://hazel-replitrpc.vercel.app/";
const url = `${server}/update/${process.platform}/${app.getVersion()}`
console.log(url, process.platform, app.getVersion())
autoUpdater.setFeedURL({url})

// this should be placed at top of main.js to handle setup events quickly
if (handleSquirrelEvent()) {
  // squirrel event handled and app will exit in 1000ms, so don't do anything else
  return
}

function handleSquirrelEvent() {
  if (process.argv.length === 1) {
    return false
  }

  const ChildProcess = require('child_process')
  const path = require('path')

  const appFolder = path.resolve(process.execPath, '..')
  const rootAtomFolder = path.resolve(appFolder, '..')
  const updateDotExe = path.resolve(path.join(rootAtomFolder, 'Update.exe'))
  const exeName = path.basename(process.execPath)

  const spawn = (command, args) => {
    let spawnedProcess, error

    try {
      spawnedProcess = ChildProcess.spawn(command, args, { detached: true })
    } catch (error) {}

    return spawnedProcess
  }

  const spawnUpdate = (args) => {
    return spawn(updateDotExe, args)
  }

  const squirrelEvent = process.argv[1]
  switch (squirrelEvent) {
    case '--squirrel-install':
    case '--squirrel-updated':
      // Install desktop and start menu shortcuts
      spawnUpdate(['--createShortcut', exeName])

      setTimeout(app.quit, 1000)
      return true

    case '--squirrel-uninstall':
      // Undo anything you did in the --squirrel-install and
      // --squirrel-updated handlers

      // Remove desktop and start menu shortcuts
      spawnUpdate(['--removeShortcut', exeName])

      setTimeout(app.quit, 1000)
      return true

    case '--squirrel-obsolete':
      // This is called on the outgoing version of your app before
      // we update to the new version - it's the opposite of
      // --squirrel-updated

      app.quit()
      return true
  }
}

// Vars

let extResources = {
  sh: 'bash',
  c: 'c',
  css: 'css3',
  html: 'html5',
  js: 'javascript',
  lua: 'lua',
  md: 'markdown',
  nix: 'nix',
  php: 'php',
  py: 'python',
  jsx: 'react',
  tsx: 'react',
  rb: 'ruby',
  ts: 'typescript',
  rs: 'rust',
  go: 'golang'
}
// i added golang
// i literally hate myself for writing this - connor

const clientId = '891607135769739285'

const createUpdaterWindow = () => {
  const browser = new BrowserWindow({
    width: 500,
    height: 500,
    frame: false,
    closable: false,
    minimizable: true,
    resizable: false,
    transparent: true,
	  alwaysOnTop: true,
    icon: app.getAppPath() + '/icons/512.ico',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: app.getAppPath() + '/view/render.js',
    },
  })
  browser.loadFile(app.getAppPath() + '/view/update.html')
  return browser;
}

const parseFileType = (fileName) => {
  const splits = fileName.split('.')
  const ext = splits[splits.length - 1]
  return ext
}

const changeStatus = (status) => {
  try {
    if (config.enabled && status.now !== {}) {
      if (!status.now.fileName) {
        return client.clearActivity()
      }
      let privacy = false
      // privacy = !(status.now.private || status.privacy)
      if (status.now.private || status.privacy) privacy = true
      // const fileName = status.now.fileName || 'a file'
      const fileName = privacy
        ? `a ${parseFileType(status.now.fileName)} file`
        : status.now.fileName || 'No file defined'
      const name = privacy
        ? 'a hidden repl'
        : status.now.name || 'No repl defined'
      const author = privacy
        ? 'hidden user'
        : status.now.user || 'No user defined'
      const link = privacy
        ? 0
        : `${status.now.name || 'null'}.${status.now.user || 'null'}.repl.co`
      if (!extResources[parseFileType(fileName)]) {
        return client.setActivity({
          details: `Editing ${fileName}`,
          state: `Working on ${name}`,
          largeImageKey: 'replit',
          largeImageText: `Logged in as `,
          // smallImageKey: parseFileType(fileName)
        })
      } else {
        return client.setActivity({
          details: `Editing ${fileName}`,
          state: `Working on ${name}`,
          largeImageKey: `${extResources[parseFileType(fileName)]}`,
          largeImageText: `Editing a ${parseFileType(
            fileName,
          ).toUpperCase()} file`,
          smallImageKey: 'replit',
          smallImageText: `Logged in as ${author}`,
          // smallImageKey: parseFileType(fileName)
        })
      }
    } else {
      // remove
      client.clearActivity()
    }
  } catch (err) {
    console.log('[NOT OK] did an oopsie')
  }
}

const router = new Router({
  prefix: '/',
})
const koa = new Koa()

let tray

let config = {
  privacy: false,
  enabled: true,
  now: {},
  lastSent: 0,
}

const client = new RPC.Client({ transport: 'ipc' })

// Log in to RPC with client id
client.login({ clientId })

setTimeout(() => {
  const now = Math.round(new Date().getTime() / 1000)
  if (config.lastSent + 15 < now) {
    config.now = {}
  }
  changeStatus()
}, 15000)

// Electron
app.whenReady().then(() => {
  /*  ELECTRON UPDATER */
  autoUpdater.checkForUpdates()
  /*  ELECTRON UPDATER */
  new Notification({
    title: 'Replit RPC',
    body: 'Replit RPC is now running and minimized to tray.',
  }).show()
  tray = new Tray(__dirname + '/icons/48.png')
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Replit RPC', enabled: true, click: ()=>{
      shell.openExternal("https://replitrpc.repl.co/")
    } },
    { label: 'Credits', enabled: true, click: ()=>{
      const bw = new BrowserWindow({
        width: 600,
        height: 400,
        autoHideMenuBar: true,
        icon: app.getAppPath() + '/icons/512.ico',
        webPreferences: {
          nodeIntegration: false,
          contextIsolation: true,
          enableRemoteModule: false,
          preload: app.getAppPath() + '/view/render.js',
        },
      })
      bw.loadFile(app.getAppPath()+"/view/credits.html")
    } },
    {
      label: 'Enabled',
      type: 'checkbox',
      click: (e) => {
        config.enabled = e.checked
        changeStatus(config.now)
      },
      checked: config.enabled,
    },
    {
      label: 'Privacy',
      type: 'checkbox',
      click: (e) => {
        config.privacy = e.checked
        changeStatus(config.now)
      },
      checked: config.privacy,
    },
    {
      label: 'Exit',
      type: 'normal',
      click: () => {
        app.quit()
        process.exit()
      },
    },
  ])
  tray.setToolTip('Replit Discord RPC')
  tray.setContextMenu(contextMenu)
})

// Koa
koa.use(cors())
koa.use(koaBody())
try {
  koa.listen(51337)
} catch {
  app.exit(1);
  process.exit(1)
}
router.post('/', (ctx, next) => {
  config.now = ctx.request.body
  config.lastSent = Math.round(new Date().getTime() / 1000);
  changeStatus(config)
  ctx.body = "ok"
  next()
})
router.get('/ping', (ctx, next) => {
  ctx.body = 'pong'
  next()
})

koa.use(router.routes())

/*  ELECTRON UPDATER */
let updaterWindow;
autoUpdater.on('checking-for-update', () => {
	updaterWindow = createUpdaterWindow();
	updaterWindow.webContents.send("checking", "");
})
autoUpdater.on('update-available', (info) => {
  updaterWindow.webContents.send("update", info);
})
autoUpdater.on('update-not-available', (info) => {
  updaterWindow.webContents.send("noUpdate", info);
  setTimeout(()=>{
    updaterWindow.destroy();
    updaterWindow = null;
  }, 1000)
})
autoUpdater.on('error', (err) => {
	if (!updaterWindow) {
		updaterWindow = createUpdaterWindow();
	}
	updaterWindow.webContents.send("error", err.message);
	setTimeout(()=>{
		updaterWindow.destroy();
    updaterWindow = null;
		app.quit();
	}, 7500)
})
autoUpdater.on('download-progress', (progressObj) => {
	updaterWindow.webContents.send("prog", progressObj);
})
autoUpdater.on('update-downloaded', (info) => {
	updaterWindow.webContents.send("restart", info);
	setTimeout(() => {
		autoUpdater.quitAndInstall();
	}, 1000);
})
/*  ELECTRON UPDATER */
