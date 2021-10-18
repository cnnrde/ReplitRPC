// Requires
const {
  app,
  BrowserWindow,
  Tray,
  Menu,
  Notification,
  ipcMain,
  ipcRenderer,
  dialog,
} = require('electron')
const Koa = require('koa')
const cors = require('@koa/cors')
const koaBody = require('koa-body')
const Router = require('koa-router')
const RPC = require('discord-rpc')
const { autoUpdater } = require('electron-updater')

// stop multi-instance
const lock = app.requestSingleInstanceLock()
if (!lock) {
  app.quit()
}

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

  const spawn = function (command, args) {
    let spawnedProcess, error

    try {
      spawnedProcess = ChildProcess.spawn(command, args, { detached: true })
    } catch (error) {}

    return spawnedProcess
  }

  const spawnUpdate = function (args) {
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
}
// i literally hate myself for writing this - connor

const clientId = '891607135769739285'

const client = new RPC.Client({ transport: 'ipc' })

// client.on('ready', () => {
//   console.log('Authed for user', client.user.username);
// })

// Log in to RPC with client id
client.login({ clientId })

// const createUpdaterWindow = () => {
//   const browser = new BrowserWindow({
//     width: 500,
//     height: 500,
//     frame: false,
//     closable: false,
//     minimizable: true,
//     resizable: false,
//     transparent: true,
//     webPreferences: {
//       nodeIntegration: false,
//       contextIsolation: true,
//       enableRemoteModule: false,
//       preload: app.getAppPath() + '/view/render.js',
//     },
//   })
//   browser.loadFile(app.getAppPath() + '/view/update.html')
//   return browser
// }

const parseFileType = (fileName) => {
  const splits = fileName.split('.')
  const ext = splits[splits.length - 1]
  return ext
}

const changeStatus = (status) => {
  try {
    if (config.enabled && status.now !== {}) {
      console.log('[OK]', status.now, status.enabled)
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
        client.setActivity({
          details: `Editing ${fileName}`,
          state: `Working on ${name}`,
          largeImageKey: 'replit',
          largeImageText: `Logged in as ${author}`,
          // smallImageKey: parseFileType(fileName)
        })
      } else {
        client.setActivity({
          details: `Editing ${fileName}`,
          state: `Working on ${name}`,
          largeImageKey: `${extResources[parseFileType(fileName)]}`,
          largeImageText: `Editing a .${parseFileType(
            fileName,
          ).toUpperCase()} file`,
          smallImageKey: 'replit',
          smallImageText: `Logged in as ${author}`,
          // smallImageKey: parseFileType(fileName)
        })
      }
      config.now = {}
    } else {
      // remove
      client.clearActivity()
    }
  } catch (err) {
    console.log('[NOT OK] did an oopsie', err)
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

setInterval(() => {
  // const now = new Date().getTime()
  // if (config.lastSent + 15 < now) {
  //   config.now = {}
  //   return
  // }
  // changeStatus(config.now)
  if (config.now) changeStatus(config)
}, 15000)

// Electron
app.whenReady().then(() => {
  /*  ELECTRON UPDATER */
  //autoUpdater.updateConfigPath = __dirname+'/app-update.yml';
  //autoUpdater.checkForUpdates();
  /*  ELECTRON UPDATER */
  // createUpdaterWindow()
  new Notification({
    title: 'Replit RPC',
    body: 'Replit RPC is now running and minimized to tray.',
  }).show()
  tray = new Tray(__dirname + '/icons/48.png')
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Replit RPC', enabled: false },
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
koa.listen(51337)
router.post('/', (ctx, next) => {
  config.now = ctx.request.body
  config.lastSent = new Date().getTime()
  // console.log(config)
  // changeStatus(config)
  ctx.body = 'ok'
  next()
})
router.get('/', (ctx, next) => {
  ctx.body = 'null'
  next()
})

// router.get('/ping', (ctx, next) => {
//   ctx.body = 'pong'
//   next()
// })

koa.use(router.routes())

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
