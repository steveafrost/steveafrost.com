---
title: "Bridging the Web and macOS with AppleScript"
date: 2026-02-18
tags:
  - applescript
  - launchd
  - macos
  - node
  - javascript
---

Our cat's Litter-Robot has an API. It can tell you when the waste drawer is full, when a cycle completes, and when something needs attention. The problem is that this information lives in their app, buried under yet another notification badge competing with dozens of others. I wanted these alerts delivered somewhere my family actually pays attention — iMessage.

That constraint led me to build [Message Relay](https://github.com/steveafrost/message-relay), a small Node.js service that accepts webhook POST requests and forwards them as iMessages. The bridge between a web request and a native macOS app turned out to be AppleScript, and keeping it all running hands-free meant learning launchd. Both were new territory for me, and both turned out to be more capable than I expected.

## Why AppleScript

There is no public iMessage API. Apple has never exposed one, and the third-party workarounds are either fragile or require handing your credentials to a service you don't control. What macOS *does* offer is AppleScript — a decades-old automation language that can script nearly any native app, including Messages.

The core of sending an iMessage through AppleScript is surprisingly small:

```applescript
tell application "Messages"
  set theService to 1st service whose service type = iMessage
  send "Hello from the command line" to buddy "+1234567890" of theService
  return "Message sent"
end tell
```

You address a `buddy` (a phone number or email) on the iMessage `service`, pass your message, and that's it. The Messages app handles delivery exactly as if you'd typed it yourself. AppleScript can be invoked from the terminal with `osascript -e`, which means any language that can shell out can send iMessages.

## Calling AppleScript from Node.js

Message Relay is an Express server. When a POST hits `/webhook`, the handler validates the payload and passes the message and recipients to the iMessage sender module. That module builds an AppleScript string and executes it with Node's `child_process.exec`:

```javascript
const { exec } = require('child_process');

const sendMessage = (phoneNumber, message) => {
  return new Promise((resolve, reject) => {
    const appleScript = `
      tell application "Messages"
        set theService to 1st service whose service type = iMessage
        send "${message}" to buddy "${phoneNumber}" of theService
      end tell
    `;

    exec(`osascript -e '${appleScript}'`, (error, stdout, stderr) => {
      if (error) return reject(error);
      if (stderr) return reject(new Error(stderr));
      resolve(stdout);
    });
  });
};
```

For group messaging, the approach shifts. Instead of addressing individual buddies, the script iterates through existing chats in the Messages app to find one whose name matches a keyword, then sends directly to that chat object:

```applescript
tell application "Messages"
  set targetChat to missing value
  repeat with c in chats
    if name of c contains "Family" then
      set targetChat to c
      exit repeat
    end if
  end repeat
  send "Litter-Robot is full!" to targetChat
end tell
```

This is the piece that made the Litter-Robot use case work. The webhook fires, the message hits the family group chat, and everyone sees it as a regular text — no extra app, no notification fatigue.

## Keeping it Running with launchd

A webhook server is useless if it's not running when the event fires. I didn't want to remember to start the service after every reboot, so I turned to launchd — the macOS init system that manages background services.

launchd uses XML property list (`.plist`) files to define services. You drop a plist in `~/Library/LaunchAgents/` and macOS takes care of starting it at login. Here's a trimmed version of the one Message Relay uses:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN"
  "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key>
  <string>com.message-relay</string>

  <key>ProgramArguments</key>
  <array>
    <string>/path/to/node</string>
    <string>/path/to/message-relay/src/server.js</string>
  </array>

  <key>WorkingDirectory</key>
  <string>/path/to/message-relay</string>

  <key>RunAtLoad</key>
  <true/>

  <key>KeepAlive</key>
  <true/>

  <key>StandardOutPath</key>
  <string>/path/to/message-relay/logs/service.log</string>

  <key>StandardErrorPath</key>
  <string>/path/to/message-relay/logs/service.error.log</string>
</dict>
</plist>
```

`RunAtLoad` starts the service at login. `KeepAlive` restarts it if it crashes. Logs route to files you can tail. Managing the service is two commands:

```bash
launchctl load ~/Library/LaunchAgents/com.message-relay.plist
launchctl unload ~/Library/LaunchAgents/com.message-relay.plist
```

After setting this up, I created shell aliases — `relay-start`, `relay-stop`, `relay-logs`, `relay-status` — so the day-to-day management feels like working with any other service.

## Gotchas

A few things tripped me up that are worth knowing going in:

**Automation permissions.** The first time `osascript` tries to control Messages, macOS will prompt you to allow it. If you're running through launchd, that prompt may never appear visibly. You need to manually grant permissions in System Settings > Privacy & Security > Automation before the service will work headlessly.

**String quoting.** AppleScript strings use double quotes, and so does the JavaScript template literal wrapping the script. If your message contains quotes or special characters, they'll break the AppleScript syntax. Sanitizing input before interpolation is important.

**Node path in the plist.** If you use `nvm`, `node` won't be at `/usr/local/bin/node`. The plist needs the absolute path to the specific Node binary — something like `/Users/you/.nvm/versions/node/v22.14.0/bin/node`. Run `which node` in your shell and use that exact path.

## The Result

The Litter-Robot webhook fires, hits Message Relay running quietly on my Mac Mini, and a text pops up in the family group chat: "Litter-Robot drawer is full." No app to install on anyone's phone. No push notification to compete with. Just a text message in a conversation that already exists.

AppleScript and launchd are not the flashiest tools, but they fill a gap that nothing else on macOS can. If you need to bridge a web service to a native app and keep it running reliably, they're worth the afternoon it takes to learn them.
