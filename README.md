# Human-Record-Player
Basic controls for [https://humanrecordplayer.com](https://humanrecordplayer.com)

<img src="https://user-images.githubusercontent.com/627794/174522134-c2590c91-1e3c-49a3-b096-6281874a0035.PNG" width="240">

## Development

Safari requires `https` to request device motion/orientation events.

1. Get a server running in the root directory (e.g., `python3 -m http.server --cgi 8000`)
2. Use [ngrok](https://ngrok.com) to explose the local server (e.g., `ngrok http 8000`)
3. Point your mobile browser at the ngrok-generated URL

**Caveats**

* Safari desktop does not support [DeviceMotion](https://developer.mozilla.org/en-US/docs/Web/API/Window/devicemotion_event) events
* Chrome desktop does support [DeviceMotion](https://developer.mozilla.org/en-US/docs/Web/API/Window/devicemotion_event) events. Chrome desktop can be used to debug with a constant playback rate.

## Credits
Shoutout to @feross for [https://github.com/feross/unmute-ios-audio](https://github.com/feross/unmute-ios-audio), and @searls for the [iOS 14.5+ patch](https://github.com/searls/unmute-ios-audio/commit/8fc05cdb0d0f63167e0d6047ed1932555b3c9491)
