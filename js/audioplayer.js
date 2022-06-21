export default class AudioPlayer {
  isPlaying = false
  isLoaded = false
  isEnded = false
  isReversed = false

  playbackRate = 1.0

  // Maintains our position within the song, independent
  // of ctx.currentTime which perpetually moves forward
  time = { prev: 0, curr: 0, total: 0 }

  // References to our two audio buffers. 
  // fwd = forward
  // bck = backward
  buff = { fwd: null, bck: null }
  src = null
  ctx = null

  // interval clock for sending update events
  clock = null

  constructor(context, o) {
    this.onTimeUpdate = o.update 
    this.onInitialize = o.init 

    this.ctx = context
  }

  init(file) {
    const filename = `${file}.${AudioPlayer.supportedCodec()}`
    let request = new XMLHttpRequest()
    request.open('GET', `${filename}`, true)
    request.responseType = 'arraybuffer'

    request.onload = () => {
      this.ctx.decodeAudioData(request.response).then(buffer => {
        if (buffer.length === 0) { throw 'Error decoding audio: 0 length buffer' }

        this.buff.fwd = buffer
        this.buff.bck = AudioPlayer.reversedBuffer(buffer)

        this.time.total = buffer.duration

        this.isLoaded = true

        if (this.onInitialize) {
          this.onInitialize()
        }

        this.clock = setInterval(this.updateCurrentTime.bind(this), 10)
      }).catch(e => {
        console.error("Error with decoding audio data: " + e)
      })
    }

    request.send()
  }

  play() {
    this.time.prev = this.ctx.currentTime

    if (this.isReversed) {
      this.switchTrack('bck')
    } else {
      this.switchTrack('fwd')
    }

    this.isPlaying = true
  }

  pause() {
    if (!this.isPlaying) return
    this.isPlaying = false

    this.src.stop(0)
    this.src.disconnect(0)

    this.src = null
  }

  end() {
    this.isEnded = true
    this.pause()

    clearInterval(this.clock, 10)
  }

  static formatTime(time) {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)

    const pad = (n) => {
      if (n < 10) return `0${n}`
      else return n
    }

    return `${pad(minutes)}:${pad(seconds)}`
  }

  updatePlaybackRate(newRate, isNegative) {
    if (isNegative && !this.isReversed) {
      this.switchTrack('bck')
      this.isReversed = true
    }
    if (!isNegative && this.isReversed) {
      this.switchTrack('fwd')
      this.isReversed = false
    }

    this.playbackRate = newRate

    if (this.isPlaying) {
      this.src.playbackRate.value = newRate 
    }
  }

  // It's necessary to maintain our own concept of "current time."
  // The complexity is 2-fold:
  //
  // 1. The playback rate is constantly changing. A playback rate of
  //    1.0 would map to ctx.currentTime 1:1. A playback rate of 0.5
  //    would map to ctx.currentTime 0.5:1. Our playback rate is
  //    variable so we're sampling the amount of "real time" that 
  //    has passed between reads and multiplying it by the playback
  //    rate at that moment. Close enough.
  //
  //  2. Playback can happen both forwards and backwards. As ctx.currentTime
  //  marches forward, we keep track of "current time" by either adding
  //  or subtracting based on the current direction
  //
  updateCurrentTime() {
    if (!this.isPlaying) return

    const delta = this.ctx.currentTime - this.time.prev
    const adjusted = delta * this.playbackRate
    this.time.prev = this.ctx.currentTime

    if (this.isReversed) {
      this.time.curr -= adjusted
    } else {
      this.time.curr += adjusted
    }

    this.time.curr = Math.max(this.time.curr, 0)
    this.time.curr = Math.min(this.time.curr, this.time.total)

    if (this.onTimeUpdate) {
      this.onTimeUpdate(this.time.curr)
    }
  }

  switchTrack(direction) {
    if (this.src && this.isPlaying) {
      this.src.stop(0)
      this.src.disconnect(0)
    }

    const buffer = direction === 'bck' ? this.buff.bck : this.buff.fwd
    const offset = direction === 'bck' ? buffer.duration - this.time.curr : this.time.curr

    const src = this.ctx.createBufferSource()
    src.buffer = buffer
    src.connect(this.ctx.destination)
    src.start(0, offset)

    this.src = src
  }

  static reversedBuffer(buffer) {
    let c0 = new Float32Array(buffer.length)
    let c1 = new Float32Array(buffer.length)

    buffer.copyFromChannel(c0, 0)
    buffer.copyFromChannel(c1, 1)

    const revBuff = new AudioBuffer({
      length: buffer.length,
      sampleRate: buffer.sampleRate,
      numberOfChannels: 2
    })

    revBuff.copyToChannel(c0.reverse(), 0)
    revBuff.copyToChannel(c1.reverse(), 1)

    return revBuff
  }

  static supportedCodec() {
    let audioElement = document.createElement('audio')
    let codec = null
    if (!!audioElement.canPlayType('audio/ogg')) {
      codec = 'ogg'
    } else if (!!audioElement.canPlayType('audio/mp3')) {
      codec =  'mp3'
    }

    return codec
  }
}
