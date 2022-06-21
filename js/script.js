import Motion from './motion.js?v=1'
import AudioPlayer from './audioplayer.js'
import { degToRpm, map } from './util.js'
import unmuteAudio from './unmute.js'

// Bypass mute hardware switch
unmuteAudio(true)


// Motion

// groove is the 'sweet spot' where we snap to 100%
// playback rate. min/max are in deg/sec. The wider the
// groove, the easier it is to play at 100% speed.
const groove = { min: 60, max: 80 }

const motion = new Motion(window, {
  update(val) {
    const absVal = Math.abs(val)

    let rate = 1.0
    if (absVal > groove.min && absVal < groove.max) {
      rate = 1.0
    } else if (absVal < groove.min) {
      rate = map(absVal, 0, groove.min, 0, 0.99)
    } else {
      rate = map(absVal, groove.max, 250, 1.01, 2.0)
    }

    audioPlayer.updatePlaybackRate(rate, val < 0)

    // Update debug UI
    const rpm = degToRpm(absVal).toFixed(0)
    playbackRateOutput.textContent = rate.toFixed(2)
    rotationRateOutput.textContent = `${val.toFixed(0)} deg/s (${rpm} RPM)`
  }
})

const permissionsButton = document.querySelector('.js-motion-permissions')
permissionsButton.addEventListener('click', () => {
  Motion.requestPermissions()
    .then(result => {
      if (result === 'granted') {
        hidePermissionsScreen()
        showLoadingAudioScreen()

        audioPlayer.init('./audio/song')
      } else {
        console.log('Device motion/orientation permissions denied. If this was a mistake, force close your browser and try again')
      }
    })
    .catch(error => {
      console.error(error)
    })
})


// Audio

const AudioContext = window.AudioContext || window.webkitAudioContext
const audioPlayer = new AudioPlayer(new AudioContext(), {
  init() {
    hideLoadingAudioScreen()
    showGetStartedScreen()
  },

  update(time) {
    const curr = AudioPlayer.formatTime(audioPlayer.time.curr)
    const tot = AudioPlayer.formatTime(audioPlayer.time.total)
    currentTimeOutput.textContent = `${curr}/${tot}`
  }
})


// Screens

const hidePermissionsScreen = () => {
  const permissionsScreen = document.querySelector('.js-permissions-screen')
  permissionsScreen.remove()
}

const showGetStartedScreen = () => {
  showScreen('get-started-screen')
  const getStartedScreen = document.querySelector('.js-get-started-screen')
  const getStartedButton = document.querySelector('.js-get-started-button')
  getStartedButton.addEventListener('click', () => {
    getStartedScreen.remove()
    showMainUI()

    motion.startUpdatingMotion()
    audioPlayer.play()
  })
}

const showLoadingAudioScreen = () => {
  showScreen('loading-audio-screen')
}

const hideLoadingAudioScreen = () => {
  const screen = document.querySelector('.js-loading-audio-screen')
  screen.remove()
}

let playbackRateOutput
let rotationRateOutput
let currentTimeOutput
const showMainUI = () => {
  showScreen('main-screen')

  playbackRateOutput = document.querySelector('.js-playback-rate')
  rotationRateOutput = document.querySelector('.js-rotation-rate')
  currentTimeOutput = document.querySelector('.js-current-time')
}

const showScreen = templateId => {
  const template = document.getElementById(templateId)
  const content = template.content.cloneNode(true)
  document.body.appendChild(content)
}
