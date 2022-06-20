export const map = (value, iStart, iEnd, oStart, oEnd) => {
  return oStart + ((oEnd - oStart) / (iEnd - iStart)) * (value - iStart)
}

export const degToRpm = (deg) => {
  return deg / 360.0 * 60
}
