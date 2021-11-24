# ReplitRPC

### What is it?

ReplitRPC is the easy way to share the current project you're working on to your friends on Discord!

## Installation

1. Download and install the Desktop app from releases, or build it yourself
2. Download and install the extension from the web store, or build it yourself

| Browser | Extension                                                                                                  |
| ------- | ---------------------------------------------------------------------------------------------------------- |
| Firefox | ~~[ReplitRPC](https://addons.mozilla.org/en-GB/firefox/addon/replit-rpc)~~ build it yourself\*<sup>1</sup> |
| Chrome  | ~~Pending approval~~ build it yourself\*<sup>2</sup>                                                       |

\*<sup>1</sup> firefox stopped extensions on the store from interfacing with unsecure webpages (meaning the ext doesn't connect)

\*<sup>2</sup> i've not picked up any development on this for a while, i really don't wanna go through the whole extension publishing process for chrome

4. Run the Desktop app
5. Open a repl

And that's it! You should see your rich presence update within 40 seconds (as long as you have a repl open with the extension installed).

## Uninstallation

### Windows

Go to `%localappdata%` and delete the `ReplitRPC` folder.
Alternatively, open the add and remove programs dialog and remove `ReplitRPC` by `Connor Dennison`.

### macOS

Delete the .app file.

### Linux

Figure it out (you use linux)

## Start on boot

### Windows

1. Press win+r to open the run box and enter `shell:startup`
2. Drag the shortcut ReplitRPC created on your desktop into the folder
3. Done (hopefully)

### macOS

1. Open System Preferences
2. Click Users & Groups
3. Click Login Items
4. Click the `+` to add a login application
5. Navigate to ReplitRPC.app
6. Add it

### Linux

1. Figure it out (you use linux)

## Contributing

like make the pull request and do the thing

## Building

Requirements:

- yarn
- node
- git (duh)

1. Clone the repo to wherever

```
git clone https://github.com/connordennison/ReplitRPC.git
```

2. cd into folder

```
cd ReplitRPC
```

3. cd into electron folder and install dependencies

```
cd electron
yarn install --dev
```

4. cd out of the electron folder

```
cd ..
```

4. Run the build command for the platform you want to build for

| Target           | Command        |
| ---------------- | -------------- |
| Chrome           | `yarn chrome`  |
| Firefox          | `yarn firefox` |
| Current platform | `yarn make`    |

You should see new files generated in `electron/out` - if you don't then I have lied to you in this readme 🙈

## FAQ <sup>(nobody has actually asked any of these)</sup>

### How does it work?

ReplitRPC has a desktop app that interfaces with Discord and the extension, and a browser extension to get information from Replit (through the redux store) to send to the desktop app.

### Is this against Discord's TOS?

No. This is literally just a rich presence.

### Can I hide the name of the repl I'm working on?

Yes! Right click the tray icon and enable Privacy mode. Your Replit username and current working repl will be hidden.
