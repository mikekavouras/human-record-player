# Reproductor de Discos Humano
[Volver al README en inglés](README.md)

Este repositorio demuestra los controles básicos para [https://humanrecordplayer.com](https://humanrecordplayer.com).

https://user-images.githubusercontent.com/627794/174651558-3efe065c-1d2a-49e8-919f-d0a784f27bf9.MP4

## Desarrollo

Safari requiere `https` para solicitar eventos de movimiento/orientación del dispositivo.

1. Ejecute un servidor en el directorio raíz (por ejemplo, `python3 -m http.server --cgi 8000`)
2. Use [ngrok](https://ngrok.com) para exponer el servidor local (por ejemplo, `ngrok http 8000`)
3. Dirija su navegador móvil a la URL generada por ngrok

## Activos de audio

Para un soporte completo en navegadores móviles, querrá proporcionar tanto `.mp3` como `.ogg`. Para obtener cualquier audio de internet...

1. Use [youtube-dl](http://ytdl-org.github.io/youtube-dl/download.html) para descargar un video de YouTube.
2. Use [ffmpeg](https://www.google.com/search?client=safari&rls=en&q=ffmpeg&ie=UTF-8&oe=UTF-8) para aislar el audio
3. Use [ffmpeg](https://www.google.com/search?client=safari&rls=en&q=ffmpeg&ie=UTF-8&oe=UTF-8) para convertir el audio a `.mp3` y `.ogg`
4. Gire

```bash
youtube-dl <URL> -o video
ffmpeg -i video.mkv -vn -acodec copy audio.aac
ffmpeg -i audio.aac audio.mp3
ffmpeg -i audio.aac audio.ogg
```

**Advertencias**

* Safari desktop no soporta eventos [DeviceMotion](https://developer.mozilla.org/en-US/docs/Web/API/Window/devicemotion_event)
* Chrome desktop sí soporta eventos [DeviceMotion](https://developer.mozilla.org/en-US/docs/Web/API/Window/devicemotion_event). Chrome desktop puede ser usado para depurar con una tasa de reproducción constante.

## Créditos
Un agradecimiento a [@feross](https://github.com/sponsors/feross) por [https://github.com/feross/unmute-ios-audio](https://github.com/feross/unmute-ios-audio), y a [@searls](https://github.com/searls) por el parche para iOS 14.5+ [https://github.com/searls/unmute-ios-audio/commit/8fc05cdb0d0f63167e0d6047ed1932555b3c9491)

## Ejemplos de Código

En esta sección, mostramos algunos fragmentos de código específicos del proyecto para darle una idea de cómo funciona.

### Inicialización de la Clase Motion

Aquí le mostramos cómo se inicializa la clase `Motion` en `js/script.js`:

```javascript
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

    // Actualizar UI de depuración
    const rpm = degToRpm(absVal).toFixed(0)
    playbackRateOutput.textContent = rate.toFixed(2)
    rotationRateOutput.textContent = `${val.toFixed(0)} deg/s (${rpm} RPM)`
  }
})
```

¿Por qué los programadores prefieren el modo oscuro? ¡Porque la luz atrae a los errores!

### El Método onMotionUpdate

Y aquí está el método `onMotionUpdate` de `js/motion.js`:

```javascript
onMotionUpdate(e) {
  let now = new Date()

  if ((now - this.lastReadAt) > Motion.MotionReadInterval) {
    this.lastReadAt = now

    const { beta, gamma } = e.rotationRate
    const isHorizontal = this.deviceOrientation === Motion.DeviceOrientation.Horizontal
    let value = (isHorizontal ? gamma : beta) * -1

    this.addValue(value)

    const sum = this.values.reduce((a, b) => { return a + b }, 0)
    const avg = sum / this.values.length // suavizado

    if (this.onMotionUpdateHandler) {
      this.onMotionUpdateHandler(avg)
    }
  }
}
```

¿Por qué estaba triste el desarrollador de JavaScript? Porque no sabía cómo des-nullificar sus sentimientos.
