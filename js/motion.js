export default class Motion {

  // Event handling
  onMotionUpdateHandler = null
  eventSrc = null

  static MotionReadInterval = 50 // smoothing
  static MaxValues = 10 // inertia
  static DeviceOrientation = { Vertical: 0, Horizontal: 1 }

  values = []
  lastReadAt = new Date()
  deviceOrientation = Motion.DeviceOrientation.Horizontal

  constructor(eventSrc, o) {
    this.onMotionUpdateHandler = o.update
    this.eventSrc = eventSrc
  }

  static requestPermissions() {
    if (typeof DeviceMotionEvent.requestPermission === 'function') {
      return DeviceMotionEvent.requestPermission()
    } else {
      return Promise.resolve("granted")
    }
  }

  startUpdatingMotion() {
    if (typeof this.eventSrc.ondevicemotion !== 'undefined') {  
      this.eventSrc.addEventListener('devicemotion', this.onMotionUpdate.bind(this))
      this.eventSrc.addEventListener('deviceorientation', this.onOrientationUpdate.bind(this))
    } else {
      console.error(`${this.eventSrc} does not support ondevicemotion`)
    }
  }

  onMotionUpdate(e) {
    let now = new Date()

    if ((now - this.lastReadAt) > Motion.MotionReadInterval) {
      this.lastReadAt = now

      const { beta, gamma } = e.rotationRate
      const isHorizontal = this.deviceOrientation === Motion.DeviceOrientation.Horizontal
      let value = (isHorizontal ? gamma : beta) * -1

      this.addValue(value)

      const sum = this.values.reduce((a, b) => { return a + b }, 0)
      const avg = sum / this.values.length // smoothed

      if (this.onMotionUpdateHandler) {
        this.onMotionUpdateHandler(avg)
      }
    }
  }

  onOrientationUpdate(e) {
    const { beta } = e

    if (beta < 45) {
      this.deviceOrientation = Motion.DeviceOrientation.Horizontal
    } else {
      this.deviceOrientation = Motion.DeviceOrientation.Vertical
    }
  }

  addValue(value) {
    this.values = this.values.slice(0, Motion.MaxValues - 1)
    this.values.unshift(value)
  }
}

