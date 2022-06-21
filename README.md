# Human Record Player
This repo demonstrates the basic controls for [https://humanrecordplayer.com](https://humanrecordplayer.com).


https://user-images.githubusercontent.com/627794/174651558-3efe065c-1d2a-49e8-919f-d0a784f27bf9.MP4


## Development

Safari requires `https` to request device motion/orientation events.

1. Get a server running in the root directory (e.g., `python3 -m http.server --cgi 8000`)
2. Use [ngrok](https://ngrok.com) to explose the local server (e.g., `ngrok http 8000`)
3. Point your mobile browser at the ngrok-generated URL

## Audio assets

For full mobile browser support you'll want to provide both `.mp3` and `.ogg`. To get any audio from the internet...

1. Use [youtube-dl](http://ytdl-org.github.io/youtube-dl/download.html) to download a YouTube video.
2. Use [ffmpeg](https://www.google.com/search?client=safari&rls=en&q=ffmpeg&ie=UTF-8&oe=UTF-8) to isolate the audio
3. Use [ffmpeg](https://www.google.com/search?client=safari&rls=en&q=ffmpeg&ie=UTF-8&oe=UTF-8) to convert audio to `.mp3` and `.ogg`
4. Spin

```bash
youtube-dl <URL> -o video
ffmpeg -i video.mkv -vn -acodec copy audio.aac
ffmpeg -i audio.aac audio.mp3
ffmpeg -i audio.aac audio.ogg
```

**Caveats**

* Safari desktop does not support [DeviceMotion](https://developer.mozilla.org/en-US/docs/Web/API/Window/devicemotion_event) events
* Chrome desktop does support [DeviceMotion](https://developer.mozilla.org/en-US/docs/Web/API/Window/devicemotion_event) events. Chrome desktop can be used to debug with a constant playback rate.

## Credits
Shoutout to [@feross](https://github.com/sponsors/feross) for [https://github.com/feross/unmute-ios-audio](https://github.com/feross/unmute-ios-audio), and [@searls](https://github.com/searls) for the [iOS 14.5+ patch](https://github.com/searls/unmute-ios-audio/commit/8fc05cdb0d0f63167e0d6047ed1932555b3c9491)
