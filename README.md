# Human-Record-Player
Basic controls for humanrecordplayer.com

<img src="https://user-images.githubusercontent.com/627794/174522134-c2590c91-1e3c-49a3-b096-6281874a0035.PNG" width="240">


## Development

Safari requires `https` to request device motion/orientation events.

1. Get a server running in the root directory (e.g., `python3 -m http.server --cgi 8000`)
2. Use [ngrok](https://ngrok.com) to explose the local server (e.g., `ngrok http 8000`)
3. Point your mobile browser at the ngrok-generated URL

**Caveats**

* Safari desktop does not support [DeviceMotion](https://developer.mozilla.org/en-US/docs/Web/API/Window/devicemotion_event) events
* Chrome desktop does support [DeviceMotion](https://developer.mozilla.org/en-US/docs/Web/API/Window/devicemotion_event) events. Chrome desktop can be used to debug with a constant playback rate.
